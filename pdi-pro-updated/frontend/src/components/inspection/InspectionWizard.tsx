import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInspection } from '../../contexts/InspectionContext';
import { Car, ChevronLeft } from 'lucide-react';
import StepIndicator from './StepIndicator';
import VehicleDetailsStep from './steps/VehicleDetailsStep';
import ExteriorConditionStep from './steps/ExteriorConditionStep';
import EngineConditionsStep from './steps/EngineConditionsStep';
import AdditionalChecksStep from './steps/AdditionalChecksStep';
import PhotosStep from './steps/PhotosStep';
import ReviewStep from './steps/ReviewStep';
import SummaryStep from './steps/SummaryStep';

const API_URL = import.meta.env.VITE_API_URL || '';

const useDebounce = (value: unknown, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const InspectionWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardLoading, setWizardLoading] = useState(true);
  const [currentInspectionId, setCurrentInspectionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { inspectionId: paramInspectionId } = useParams<{ inspectionId: string }>();
  const { user, logout } = useAuth();
  const { inspectionData, setInspectionData, resetInspection } = useInspection();
  const debouncedInspectionData = useDebounce(inspectionData, 1000);

  // resetInspection is available if needed for future use
  void resetInspection;

  const totalSteps = 7;

  useEffect(() => {
    const loadOrCreateInspection = async () => {
      if (paramInspectionId && currentInspectionId === paramInspectionId) {
        setWizardLoading(false);
        return;
      }

      setWizardLoading(true);

      try {
        if (paramInspectionId) {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/api/inspections/${paramInspectionId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setInspectionData(data.inspection);
            setCurrentInspectionId(paramInspectionId);
          } else {
            console.error('Failed to load inspection');
            navigate('/dashboard');
            return;
          }
        } else if (!currentInspectionId) {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/api/inspections`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(inspectionData),
          });

          if (response.ok) {
            const data = await response.json();
            const newId = data.inspection._id;
            setCurrentInspectionId(newId);
            navigate(`/inspection/${newId}`, { replace: true });
          } else {
            console.error('Failed to create inspection');
            navigate('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Error loading/creating inspection:', error);
        navigate('/dashboard');
      } finally {
        setWizardLoading(false);
      }
    };

    loadOrCreateInspection();
  }, [paramInspectionId, currentInspectionId, navigate, inspectionData, setInspectionData]);

  useEffect(() => {
    if (wizardLoading || !currentInspectionId) return;

    const saveInspection = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/inspections/${currentInspectionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(inspectionData),
        });
        if (!response.ok) {
          console.error('Save failed:', response.status);
        } else {
          console.log('Auto-saved inspection draft');
        }
      } catch (error) {
        console.error('Error saving inspection:', error);
      }
    };

    saveInspection();
  }, [debouncedInspectionData, currentInspectionId, wizardLoading]);

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <VehicleDetailsStep onNext={handleNextStep} />;
      case 2:
        return <ExteriorConditionStep onNext={handleNextStep} onPrev={handlePrevStep} />;
      case 3:
        return <EngineConditionsStep onNext={handleNextStep} onPrev={handlePrevStep} />;
      case 4:
        return <AdditionalChecksStep onNext={handleNextStep} onPrev={handlePrevStep} />;
      case 5:
        return <PhotosStep onNext={handleNextStep} onPrev={handlePrevStep} />;
      case 6:
        return <ReviewStep onNext={handleNextStep} onPrev={handlePrevStep} />;
      case 7:
        return <SummaryStep onPrev={handlePrevStep} inspectionId={currentInspectionId ?? undefined} />;
      default:
        return <VehicleDetailsStep onNext={handleNextStep} />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Vehicle Details';
      case 2: return 'Exterior';
      case 3: return 'Engine';
      case 4: return 'Additional Checks';
      case 5: return 'Photos';
      case 6: return 'Review';
      case 7: return 'Summary';
      default: return 'Vehicle Details';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Dashboard
            </button>
            <Car className="w-8 h-8 text-blue-600 mr-3" />
            <span className="text-xl font-semibold text-gray-800">PDC Pro</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitle={getStepTitle()}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {wizardLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {paramInspectionId ? 'Loading Inspection...' : 'Creating New Inspection...'}
              </h3>
              <p className="text-gray-600">Please wait while we prepare your inspection form.</p>
            </div>
          ) : (
            renderStep()
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionWizard;
