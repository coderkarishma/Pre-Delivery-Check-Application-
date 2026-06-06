import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { createRoot } from 'react-dom/client';
import PDFContent from '../components/inspection/PDFContent';

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

export const generateInspectionPDF = async (inspectionData: InspectionData): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.backgroundColor = 'white';
      document.body.appendChild(tempContainer);

      const root = createRoot(tempContainer);
    root.render(React.createElement(PDFContent, { inspectionData }));

      setTimeout(async () => {
        try {
          const canvas = await html2canvas(tempContainer, {
            useCORS: true,
            allowTaint: true,
            scale: 2,
            logging: false,
            width: 800,
            height: tempContainer.scrollHeight
          });

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 0;

          const pageHeight = pdfHeight;
          const totalHeight = imgHeight * ratio;

          if (totalHeight <= pageHeight) {
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
          } else {
            let position = 0;
            const pageCanvas = document.createElement('canvas');
            const pageCtx = pageCanvas.getContext('2d');
            pageCanvas.width = canvas.width;

            while (position < totalHeight) {
              const pageHeightInPixels = pageHeight / ratio;
              pageCanvas.height = Math.min(pageHeightInPixels, canvas.height - (position / ratio));

              if (pageCtx) {
                pageCtx.drawImage(
                  canvas,
                  0, position / ratio,
                  canvas.width, pageCanvas.height,
                  0, 0,
                  canvas.width, pageCanvas.height
                );
              }

              const pageImgData = pageCanvas.toDataURL('image/png');

              if (position > 0) {
                pdf.addPage();
              }

              pdf.addImage(pageImgData, 'PNG', imgX, 0, imgWidth * ratio, pageCanvas.height * ratio);
              position += pageHeight;
            }
          }

          const clientName = inspectionData.vehicleDetails.clientName || 'Client';
          const vehicleMake = inspectionData.vehicleDetails.vehicleMake || 'Vehicle';
          const vehicleModel = inspectionData.vehicleDetails.vehicleModel || '';
          const date = new Date().toISOString().split('T')[0];
          const filename = `PDC_Report_${clientName}_${vehicleMake}_${vehicleModel}_${date}.pdf`.replace(/\s+/g, '_');

          pdf.save(filename);

          root.unmount();
          document.body.removeChild(tempContainer);

          resolve();
        } catch (error) {
          root.unmount();
          document.body.removeChild(tempContainer);
          reject(error);
        }
      }, 2000);
    } catch (error) {
      reject(error);
    }
  });
};
