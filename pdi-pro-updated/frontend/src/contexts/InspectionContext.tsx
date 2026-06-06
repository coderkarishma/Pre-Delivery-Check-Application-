import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VehicleDetails {
  clientName: string;
  vehicleMake: string;
  vehicleModel: string;
  yearOfManufacture: string;
  exteriorColor: string;
  mileage: string;
  vehicleIdentificationNumber: string;
  carNumberPlate: string;
}

interface ConditionItem {
  status: 'OK' | 'Issue' | 'N/A';
  description: string;
}

interface ExteriorCondition {
  paintCondition: ConditionItem;
  bodyworkCondition: ConditionItem;
  tireCondition: ConditionItem;
  lightsFunctionality: ConditionItem;
  frontBumper: ConditionItem;
  rearBumper: ConditionItem;
  trunkHatch: ConditionItem;
}

interface EngineConditions {
  engineHealth: ConditionItem;
  oilCondition: ConditionItem;
  coolantLevel: ConditionItem;
  batteryCondition: ConditionItem;
  beltsAndHoses: ConditionItem;
}

interface AdditionalChecks {
  brakeSystem: ConditionItem;
  suspension: ConditionItem;
  steering: ConditionItem;
  transmission: ConditionItem;
  airConditioning: ConditionItem;
}

interface Images {
  frontPhoto: string;
  rhsSidePhoto: string;
  lhsSidePhoto: string;
  roofSidePhoto: string;
  additionalPhotos: string[];
}

interface InspectionData {
  vehicleDetails: VehicleDetails;
  exteriorCondition: ExteriorCondition;
  engineConditions: EngineConditions;
  additionalChecks: AdditionalChecks;
  images: Images;
  status: 'Draft' | 'Completed';
}

interface InspectionContextType {
  inspectionData: InspectionData;
  updateVehicleDetails: (data: Partial<VehicleDetails>) => void;
  updateExteriorCondition: (data: Partial<ExteriorCondition>) => void;
  updateEngineConditions: (data: Partial<EngineConditions>) => void;
  updateAdditionalChecks: (data: Partial<AdditionalChecks>) => void;
  updateImages: (data: Partial<Images>) => void;
  setInspectionData: (data: InspectionData) => void;
  resetInspection: () => void;
}

const defaultCondition: ConditionItem = { status: 'OK', description: '' };

const initialData: InspectionData = {
  vehicleDetails: {
    clientName: '',
    vehicleMake: '',
    vehicleModel: '',
    yearOfManufacture: '',
    exteriorColor: '',
    mileage: '',
    vehicleIdentificationNumber: '',
    carNumberPlate: ''
  },
  exteriorCondition: {
    paintCondition: defaultCondition,
    bodyworkCondition: defaultCondition,
    tireCondition: defaultCondition,
    lightsFunctionality: defaultCondition,
    frontBumper: defaultCondition,
    rearBumper: defaultCondition,
    trunkHatch: defaultCondition
  },
  engineConditions: {
    engineHealth: defaultCondition,
    oilCondition: defaultCondition,
    coolantLevel: defaultCondition,
    batteryCondition: defaultCondition,
    beltsAndHoses: defaultCondition
  },
  additionalChecks: {
    brakeSystem: defaultCondition,
    suspension: defaultCondition,
    steering: defaultCondition,
    transmission: defaultCondition,
    airConditioning: defaultCondition
  },
  images: {
    frontPhoto: '',
    rhsSidePhoto: '',
    lhsSidePhoto: '',
    roofSidePhoto: '',
    additionalPhotos: []
  },
  status: 'Draft'
};

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export const useInspection = () => {
  const context = useContext(InspectionContext);
  if (context === undefined) {
    throw new Error('useInspection must be used within an InspectionProvider');
  }
  return context;
};

interface InspectionProviderProps {
  children: ReactNode;
}

export const InspectionProvider: React.FC<InspectionProviderProps> = ({ children }) => {
  const [inspectionData, setInspectionDataState] = useState<InspectionData>(initialData);

  const updateVehicleDetails = (data: Partial<VehicleDetails>) => {
    setInspectionDataState(prev => ({
      ...prev,
      vehicleDetails: { ...prev.vehicleDetails, ...data }
    }));
  };

  const updateExteriorCondition = (data: Partial<ExteriorCondition>) => {
    setInspectionDataState(prev => ({
      ...prev,
      exteriorCondition: { ...prev.exteriorCondition, ...data }
    }));
  };

  const updateEngineConditions = (data: Partial<EngineConditions>) => {
    setInspectionDataState(prev => ({
      ...prev,
      engineConditions: { ...prev.engineConditions, ...data }
    }));
  };

  const updateAdditionalChecks = (data: Partial<AdditionalChecks>) => {
    setInspectionDataState(prev => ({
      ...prev,
      additionalChecks: { ...prev.additionalChecks, ...data }
    }));
  };

  const updateImages = (data: Partial<Images>) => {
    setInspectionDataState(prev => ({
      ...prev,
      images: { ...prev.images, ...data }
    }));
  };

  const resetInspection = () => {
    setInspectionDataState(initialData);
  };

  const value = {
    inspectionData,
    updateVehicleDetails,
    updateExteriorCondition,
    updateEngineConditions,
    updateAdditionalChecks,
    updateImages,
    setInspectionData: setInspectionDataState,
    resetInspection,
  };

  return <InspectionContext.Provider value={value}>{children}</InspectionContext.Provider>;
};