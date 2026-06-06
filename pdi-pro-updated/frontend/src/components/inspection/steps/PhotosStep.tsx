import React, { useState } from 'react';
import { useInspection } from '../../../contexts/InspectionContext';
import { Camera, Upload } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface PhotosStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const PhotosStep: React.FC<PhotosStepProps> = ({ onNext, onPrev }) => {
  const { inspectionData, updateImages } = useInspection();
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const handleFileUpload = async (file: File, field: string) => {
    setUploading(prev => ({ ...prev, [field]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/inspections/temp/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateImages({ [field]: data.imageUrl });
      } else {
        alert('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const renderPhotoUploader = (
    label: string,
    field: keyof typeof inspectionData.images,
    required = true
  ) => {
    const imageUrl = inspectionData.images[field] as string;
    const isUploading = uploading[field];

    function handleFileSelect(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
      event.preventDefault();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          handleFileUpload(file, field);
        }
      };
      input.click();
    }

    return (
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{label}</h3>
          {required && <span className="text-xs text-gray-500">Required</span>}
        </div>

        {imageUrl ? (
          <div className="space-y-4">
            <img
              src={imageUrl}
              alt={label}
              className="w-full h-48 object-cover rounded-lg mx-auto"
            />
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleFileSelect}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Replace Photo
              </button>
              <button
                onClick={() => updateImages({ [field]: '' })}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Camera className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-500 text-sm">Drop an image or click to select</p>
            <button
              onClick={handleFileSelect}
              disabled={isUploading}
              className="flex items-center justify-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Take / Choose Photo
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Required Photos</h2>
        <p className="text-gray-600">Please upload all required photos of the vehicle. Use your device's camera or select from your gallery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {renderPhotoUploader('Front Photo', 'frontPhoto')}
        {renderPhotoUploader('RHS Side Photo', 'rhsSidePhoto')}
        {renderPhotoUploader('LHS Side Photo', 'lhsSidePhoto')}
        {renderPhotoUploader('Roof Side Photo', 'roofSidePhoto')}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Photos (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-xs mb-3">Additional Photo {index}</p>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      console.log('Additional photo upload:', file);
                    }
                  };
                  input.click();
                }}
                className="flex items-center justify-center bg-gray-50 text-gray-600 px-3 py-2 rounded text-xs hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors mx-auto"
              >
                <Upload className="w-3 h-3 mr-1" />
                Upload
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PhotosStep;
