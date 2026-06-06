import React, { useState } from 'react';
import { useInspection } from '../../../contexts/InspectionContext';

interface EngineConditionsStepProps {
  onNext: () => void;
  onPrev: () => void;
}

interface ConditionItem {
  status: 'OK' | 'Issue' | 'N/A';
  description: string;
}

const EngineConditionsStep: React.FC<EngineConditionsStepProps> = ({ onNext, onPrev }) => {
  const { inspectionData, updateEngineConditions } = useInspection();
  const [formData, setFormData] = useState(inspectionData.engineConditions);

  const handleConditionChange = (field: string, status: 'OK' | 'Issue' | 'N/A') => {
    const updatedData = {
      ...formData,
      [field]: { ...formData[field as keyof typeof formData], status }
    };
    setFormData(updatedData);
    updateEngineConditions(updatedData);
  };

  const handleDescriptionChange = (field: string, description: string) => {
    const updatedData = {
      ...formData,
      [field]: { ...formData[field as keyof typeof formData], description }
    };
    setFormData(updatedData);
    updateEngineConditions(updatedData);
  };

  const renderConditionField = (
    label: string,
    field: string,
    condition: ConditionItem
  ) => (
    <div key={field} className="border-b border-gray-100 pb-4 mb-4 last:border-b-0">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center space-x-4">
          {(['OK', 'Issue', 'N/A'] as const).map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="radio"
                name={field}
                value={status}
                checked={condition.status === status}
                onChange={() => handleConditionChange(field, status)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>
      {condition.status === 'Issue' && (
        <textarea
          value={condition.description}
          onChange={(e) => handleDescriptionChange(field, e.target.value)}
          placeholder="Describe the issue..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          rows={2}
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Engine Conditions</h2>
        <p className="text-gray-600">Check the engine and related systems for proper functionality.</p>
      </div>

      <div className="space-y-4">
        {renderConditionField('Engine Health', 'engineHealth', formData.engineHealth)}
        {renderConditionField('Oil Condition', 'oilCondition', formData.oilCondition)}
        {renderConditionField('Coolant Level', 'coolantLevel', formData.coolantLevel)}
        {renderConditionField('Battery Condition', 'batteryCondition', formData.batteryCondition)}
        {renderConditionField('Belts and Hoses', 'beltsAndHoses', formData.beltsAndHoses)}
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

export default EngineConditionsStep;