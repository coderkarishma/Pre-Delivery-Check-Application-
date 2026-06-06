import React from 'react';
import { useInspection } from '../../../contexts/InspectionContext';

interface ReviewStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onNext, onPrev }) => {
  const { inspectionData } = useInspection();

  const renderConditionStatus = (condition: { status: string; description: string }) => (
    <div className="flex items-center space-x-2">
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          condition.status === 'OK'
            ? 'bg-green-100 text-green-800'
            : condition.status === 'Issue'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {condition.status}
      </span>
      {condition.status === 'Issue' && condition.description && (
        <span className="text-sm text-gray-600">- {condition.description}</span>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Finalize</h2>
        <p className="text-gray-600">Review all inspection details before submitting.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Client:</span>
              <span className="ml-2 text-gray-900">{inspectionData.vehicleDetails.clientName || 'Not specified'}</span>
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
              <span className="font-medium text-gray-700">Color:</span>
              <span className="ml-2 text-gray-900">{inspectionData.vehicleDetails.exteriorColor}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Mileage:</span>
              <span className="ml-2 text-gray-900">{inspectionData.vehicleDetails.mileage} km</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">VIN:</span>
              <span className="ml-2 text-gray-900">{inspectionData.vehicleDetails.vehicleIdentificationNumber}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">License Plate:</span>
              <span className="ml-2 text-gray-900">{inspectionData.vehicleDetails.carNumberPlate}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Exterior Condition</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Paint Condition:</span>
              {renderConditionStatus(inspectionData.exteriorCondition.paintCondition)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Bodywork:</span>
              {renderConditionStatus(inspectionData.exteriorCondition.bodyworkCondition)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Tires:</span>
              {renderConditionStatus(inspectionData.exteriorCondition.tireCondition)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Lights Functionality:</span>
              {renderConditionStatus(inspectionData.exteriorCondition.lightsFunctionality)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Front Bumper:</span>
              {renderConditionStatus(inspectionData.exteriorCondition.frontBumper)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Rear Bumper:</span>
              {renderConditionStatus(inspectionData.exteriorCondition.rearBumper)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Trunk/Hatch:</span>
              {renderConditionStatus(inspectionData.exteriorCondition.trunkHatch)}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Engine Conditions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Engine Health:</span>
              {renderConditionStatus(inspectionData.engineConditions.engineHealth)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Oil Condition:</span>
              {renderConditionStatus(inspectionData.engineConditions.oilCondition)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Coolant Level:</span>
              {renderConditionStatus(inspectionData.engineConditions.coolantLevel)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Battery:</span>
              {renderConditionStatus(inspectionData.engineConditions.batteryCondition)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Belts and Hoses:</span>
              {renderConditionStatus(inspectionData.engineConditions.beltsAndHoses)}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Checks</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Brake System:</span>
              {renderConditionStatus(inspectionData.additionalChecks.brakeSystem)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Suspension:</span>
              {renderConditionStatus(inspectionData.additionalChecks.suspension)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Steering:</span>
              {renderConditionStatus(inspectionData.additionalChecks.steering)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Transmission:</span>
              {renderConditionStatus(inspectionData.additionalChecks.transmission)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Air Conditioning:</span>
              {renderConditionStatus(inspectionData.additionalChecks.airConditioning)}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {inspectionData.images.frontPhoto && (
              <div>
                <img
                  src={inspectionData.images.frontPhoto}
                  alt="Front Photo"
                  className="w-full h-20 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-600 mt-1">Front</p>
              </div>
            )}
            {inspectionData.images.rhsSidePhoto && (
              <div>
                <img
                  src={inspectionData.images.rhsSidePhoto}
                  alt="RHS Side Photo"
                  className="w-full h-20 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-600 mt-1">RHS Side</p>
              </div>
            )}
            {inspectionData.images.lhsSidePhoto && (
              <div>
                <img
                  src={inspectionData.images.lhsSidePhoto}
                  alt="LHS Side Photo"
                  className="w-full h-20 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-600 mt-1">LHS Side</p>
              </div>
            )}
            {inspectionData.images.roofSidePhoto && (
              <div>
                <img
                  src={inspectionData.images.roofSidePhoto}
                  alt="Roof Side Photo"
                  className="w-full h-20 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-600 mt-1">Roof</p>
              </div>
            )}
          </div>
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
          Complete Inspection
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;