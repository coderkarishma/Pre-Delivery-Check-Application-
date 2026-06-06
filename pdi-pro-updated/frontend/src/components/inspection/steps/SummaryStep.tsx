import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspection } from '../../../contexts/InspectionContext';
import { CheckCircle, Download } from 'lucide-react';
import { generateInspectionPDF } from '../../../utils/pdfGenerator';

const API_URL = import.meta.env.VITE_API_URL || '';

interface SummaryStepProps {
  onPrev: () => void;
  inspectionId?: string;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ onPrev, inspectionId }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const { inspectionData, resetInspection } = useInspection();
  const navigate = useNavigate();

  const handleSaveInspection = async () => {
    if (!inspectionId) {
      alert('Error: No inspection ID found. Please try again.');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/inspections/${inspectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...inspectionData,
          status: 'Completed'
        }),
      });

      if (response.ok) {
        setSaved(true);
      } else {
        const errorText = await response.text();
        console.error('Status:', response.status);
        console.error('Error:', errorText);
        alert('Failed to save inspection. Please try again.');
      }
    } catch (error) {
      console.error('Save inspection error:', error);
      alert('Failed to save inspection. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBackToDashboard = () => {
    resetInspection();
    navigate('/dashboard');
  };

  const generatePDF = async () => {
    setGeneratingPDF(true);

    try {
      await generateInspectionPDF(inspectionData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="text-center">
      {!saved ? (
        <>
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Inspection Complete!</h2>
            <p className="text-gray-600">
              Your inspection has been completed successfully. Click the button below to save it to your account.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inspection Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-left">
              <div>
                <span className="font-medium text-gray-700">Client:</span>
                <span className="ml-2 text-gray-900">{inspectionData.vehicleDetails.clientName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Vehicle:</span>
                <span className="ml-2 text-gray-900">
                  {inspectionData.vehicleDetails.vehicleMake} {inspectionData.vehicleDetails.vehicleModel}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Year:</span>
                <span className="ml-2 text-gray-900">{inspectionData.vehicleDetails.yearOfManufacture}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 text-green-600 font-medium">Completed</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onPrev}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleSaveInspection}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Inspection'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Inspection Saved!</h2>
            <p className="text-gray-600">
              Your inspection has been successfully saved to your account.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={generatePDF}
              disabled={generatingPDF}
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
            </button>
            <button
              onClick={handleBackToDashboard}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SummaryStep;
