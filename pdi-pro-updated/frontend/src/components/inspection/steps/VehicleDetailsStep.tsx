import React, { useState } from 'react';
import { useInspection } from '../../../contexts/InspectionContext';

interface VehicleDetailsStepProps {
  onNext: () => void;
}

const VehicleDetailsStep: React.FC<VehicleDetailsStepProps> = ({ onNext }) => {
  const { inspectionData, updateVehicleDetails } = useInspection();
  const [formData, setFormData] = useState(inspectionData.vehicleDetails);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    updateVehicleDetails(updatedData);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Client & Vehicle Details</h2>
        <p className="text-gray-600">Start by entering the basic information for the client and the vehicle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Name
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Make
          </label>
          <input
            type="text"
            value={formData.vehicleMake}
            onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Model
          </label>
          <input
            type="text"
            value={formData.vehicleModel}
            onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year of Manufacture
          </label>
          <input
            type="text"
            value={formData.yearOfManufacture}
            onChange={(e) => handleInputChange('yearOfManufacture', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exterior Color
          </label>
          <input
            type="text"
            value={formData.exteriorColor}
            onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mileage (in kilometers)
          </label>
          <input
            type="text"
            value={formData.mileage}
            onChange={(e) => handleInputChange('mileage', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Identification Number (VIN)
          </label>
          <input
            type="text"
            value={formData.vehicleIdentificationNumber}
            onChange={(e) => handleInputChange('vehicleIdentificationNumber', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Number Plate
          </label>
          <input
            type="text"
            value={formData.carNumberPlate}
            onChange={(e) => handleInputChange('carNumberPlate', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VehicleDetailsStep;