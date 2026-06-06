import React from 'react';

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

interface PDFContentProps {
  inspectionData: InspectionData;
}

const PDFContent: React.FC<PDFContentProps> = ({ inspectionData }) => {
  const renderConditionItem = (label: string, condition: ConditionItem) => (
    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontWeight: '500', color: '#374151', minWidth: '150px' }}>{label}:</span>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: condition.status === 'OK' ? '#dcfce7' : condition.status === 'Issue' ? '#fecaca' : '#f3f4f6',
            color: condition.status === 'OK' ? '#166534' : condition.status === 'Issue' ? '#dc2626' : '#6b7280'
          }}
        >
          {condition.status}
        </span>
        {condition.status === 'Issue' && condition.description && (
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
            {condition.description}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '40px',
      backgroundColor: 'white',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          PDC Pro Vehicle Inspection Report
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Generated on {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
          Vehicle Details
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <strong style={{ color: '#374151' }}>Client Name:</strong>
            <span style={{ marginLeft: '8px', color: '#1f2937' }}>{inspectionData.vehicleDetails.clientName || 'Not specified'}</span>
          </div>
          <div>
            <strong style={{ color: '#374151' }}>Vehicle:</strong>
            <span style={{ marginLeft: '8px', color: '#1f2937' }}>
              {inspectionData.vehicleDetails.vehicleMake} {inspectionData.vehicleDetails.vehicleModel}
            </span>
          </div>
          <div>
            <strong style={{ color: '#374151' }}>Year:</strong>
            <span style={{ marginLeft: '8px', color: '#1f2937' }}>{inspectionData.vehicleDetails.yearOfManufacture}</span>
          </div>
          <div>
            <strong style={{ color: '#374151' }}>Color:</strong>
            <span style={{ marginLeft: '8px', color: '#1f2937' }}>{inspectionData.vehicleDetails.exteriorColor}</span>
          </div>
          <div>
            <strong style={{ color: '#374151' }}>Mileage:</strong>
            <span style={{ marginLeft: '8px', color: '#1f2937' }}>{inspectionData.vehicleDetails.mileage} km</span>
          </div>
          <div>
            <strong style={{ color: '#374151' }}>VIN:</strong>
            <span style={{ marginLeft: '8px', color: '#1f2937' }}>{inspectionData.vehicleDetails.vehicleIdentificationNumber}</span>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <strong style={{ color: '#374151' }}>License Plate:</strong>
            <span style={{ marginLeft: '8px', color: '#1f2937' }}>{inspectionData.vehicleDetails.carNumberPlate}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
          Exterior Condition
        </h2>
        <div>
          {renderConditionItem('Paint Condition', inspectionData.exteriorCondition.paintCondition)}
          {renderConditionItem('Bodywork Condition', inspectionData.exteriorCondition.bodyworkCondition)}
          {renderConditionItem('Tire Condition', inspectionData.exteriorCondition.tireCondition)}
          {renderConditionItem('Lights Functionality', inspectionData.exteriorCondition.lightsFunctionality)}
          {renderConditionItem('Front Bumper', inspectionData.exteriorCondition.frontBumper)}
          {renderConditionItem('Rear Bumper', inspectionData.exteriorCondition.rearBumper)}
          {renderConditionItem('Trunk/Hatch', inspectionData.exteriorCondition.trunkHatch)}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
          Engine Conditions
        </h2>
        <div>
          {renderConditionItem('Engine Health', inspectionData.engineConditions.engineHealth)}
          {renderConditionItem('Oil Condition', inspectionData.engineConditions.oilCondition)}
          {renderConditionItem('Coolant Level', inspectionData.engineConditions.coolantLevel)}
          {renderConditionItem('Battery Condition', inspectionData.engineConditions.batteryCondition)}
          {renderConditionItem('Belts and Hoses', inspectionData.engineConditions.beltsAndHoses)}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
          Additional Checks
        </h2>
        <div>
          {renderConditionItem('Brake System', inspectionData.additionalChecks.brakeSystem)}
          {renderConditionItem('Suspension', inspectionData.additionalChecks.suspension)}
          {renderConditionItem('Steering', inspectionData.additionalChecks.steering)}
          {renderConditionItem('Transmission', inspectionData.additionalChecks.transmission)}
          {renderConditionItem('Air Conditioning', inspectionData.additionalChecks.airConditioning)}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
          Vehicle Photos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {inspectionData.images.frontPhoto && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Front Photo</h3>
              <img
                src={inspectionData.images.frontPhoto}
                alt="Front Photo"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                crossOrigin="anonymous"
              />
            </div>
          )}
          {inspectionData.images.rhsSidePhoto && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>RHS Side Photo</h3>
              <img
                src={inspectionData.images.rhsSidePhoto}
                alt="RHS Side Photo"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                crossOrigin="anonymous"
              />
            </div>
          )}
          {inspectionData.images.lhsSidePhoto && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>LHS Side Photo</h3>
              <img
                src={inspectionData.images.lhsSidePhoto}
                alt="LHS Side Photo"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                crossOrigin="anonymous"
              />
            </div>
          )}
          {inspectionData.images.roofSidePhoto && (
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Roof Side Photo</h3>
              <img
                src={inspectionData.images.roofSidePhoto}
                alt="Roof Side Photo"
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: '12px', color: '#6b7280' }}>
          © 2025 PDC Pro. All rights reserved.<br />
          Made by <span style={{ color: '#2563eb' }}>Karishma</span>
        </p>
      </div>
    </div>
  );
};

export default PDFContent;