import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SymptomData {
  id: string;
  symptomName: string;
  bodyLocation: string;
  severity: number;
  status: string;
  startedAt: string;
  triageAssessment?: {
    urgencyLevel: string;
    recommendation: string;
  };
  details?: {
    notes: string;
    characteristic?: string;
    frequency?: string;
  };
}

interface AIInsightData {
  symptomName: string;
  severity: number;
  insights: {
    possibleCauses: string[];
    riskAssessment: string;
    recommendations: string[];
    urgencyLevel: string;
    disclaimer: string;
  };
}

export const generateSymptomsPDF = (symptoms: SymptomData[], userName: string = 'User') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header with gradient effect (simulated with colors)
  doc.setFillColor(99, 102, 241); // Indigo
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Symptom Report', pageWidth / 2, 20, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated for: ${userName}`, pageWidth / 2, 30, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Report Date: ${currentDate}`, pageWidth / 2, 37, { align: 'center' });
  
  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  
  let yPosition = 50;
  
  // Summary Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(99, 102, 241);
  doc.text('Summary', 14, yPosition);
  yPosition += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const statusCounts = symptoms.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  doc.text(`Total Symptoms: ${symptoms.length}`, 14, yPosition);
  yPosition += 6;
  
  Object.entries(statusCounts).forEach(([status, count]) => {
    doc.text(`${status}: ${count}`, 20, yPosition);
    yPosition += 5;
  });
  
  yPosition += 10;
  
  // Symptoms Table
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(99, 102, 241);
  doc.text('Detailed Symptoms', 14, yPosition);
  yPosition += 5;
  
  const tableData = symptoms.map(symptom => [
    new Date(symptom.startedAt).toLocaleDateString(),
    symptom.symptomName,
    symptom.bodyLocation,
    `${symptom.severity}/10`,
    symptom.status,
    symptom.triageAssessment?.urgencyLevel || 'N/A'
  ]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Date', 'Symptom', 'Location', 'Severity', 'Status', 'Urgency']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { top: 10 }
  });
  
  // Add detailed notes on new pages if available
  let hasDetails = false;
  symptoms.forEach((symptom, index) => {
    if (symptom.details?.notes || symptom.triageAssessment?.recommendation) {
      if (!hasDetails) {
        doc.addPage();
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text('Detailed Notes & Recommendations', 14, 20);
        yPosition = 30;
        hasDetails = true;
      }
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${symptom.symptomName} - ${symptom.bodyLocation}`, 14, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Date: ${new Date(symptom.startedAt).toLocaleDateString()} | Severity: ${symptom.severity}/10`, 14, yPosition);
      yPosition += 6;
      
      if (symptom.details?.notes) {
        doc.setTextColor(0, 0, 0);
        const splitNotes = doc.splitTextToSize(`Notes: ${symptom.details.notes}`, pageWidth - 28);
        doc.text(splitNotes, 14, yPosition);
        yPosition += splitNotes.length * 5 + 2;
      }
      
      if (symptom.triageAssessment?.recommendation) {
        doc.setTextColor(99, 102, 241);
        const splitRec = doc.splitTextToSize(`Recommendation: ${symptom.triageAssessment.recommendation}`, pageWidth - 28);
        doc.text(splitRec, 14, yPosition);
        yPosition += splitRec.length * 5 + 8;
      }
    }
  });
  
  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Smart Symptom Log & Triage Assistant - Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const generateAIInsightsPDF = (insightData: AIInsightData, userName: string = 'User') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header with gradient effect
  doc.setFillColor(139, 92, 246); // Purple
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Health Insights Report', pageWidth / 2, 20, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${insightData.symptomName} Analysis`, pageWidth / 2, 30, { align: 'center' });
  
  // Date and User
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated: ${currentDate} | Patient: ${userName}`, pageWidth / 2, 40, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  let yPosition = 60;
  
  // Severity Badge
  doc.setFillColor(239, 68, 68); // Red for severity
  if (insightData.severity <= 3) {
    doc.setFillColor(34, 197, 94); // Green
  } else if (insightData.severity <= 6) {
    doc.setFillColor(251, 191, 36); // Yellow
  }
  doc.roundedRect(14, yPosition - 5, 40, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Severity: ${insightData.severity}/10`, 34, yPosition + 1, { align: 'center' });
  
  // Urgency Level
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(219, 234, 254); // Light blue
  doc.roundedRect(60, yPosition - 5, 60, 10, 2, 2, 'F');
  doc.setTextColor(30, 64, 175); // Dark blue
  doc.text(`Urgency: ${insightData.insights.urgencyLevel}`, 90, yPosition + 1, { align: 'center' });
  
  yPosition += 20;
  
  // Risk Assessment Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text('🔍 Risk Assessment', 14, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const riskText = doc.splitTextToSize(insightData.insights.riskAssessment, pageWidth - 28);
  doc.text(riskText, 14, yPosition);
  yPosition += riskText.length * 5 + 10;
  
  // Possible Causes Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text('💡 Possible Causes', 14, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  insightData.insights.possibleCauses.forEach((cause, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    const causeText = doc.splitTextToSize(`${index + 1}. ${cause}`, pageWidth - 28);
    doc.text(causeText, 14, yPosition);
    yPosition += causeText.length * 5 + 4;
  });
  
  yPosition += 6;
  
  // Recommendations Section
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text('✅ Recommendations', 14, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  insightData.insights.recommendations.forEach((rec, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    const recText = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 28);
    doc.text(recText, 14, yPosition);
    yPosition += recText.length * 5 + 4;
  });
  
  // Disclaimer Section
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }
  
  yPosition += 10;
  doc.setFillColor(254, 242, 242); // Light red background
  doc.roundedRect(10, yPosition - 5, pageWidth - 20, 35, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38); // Red
  doc.text('⚠️ Important Disclaimer', 14, yPosition + 2);
  yPosition += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(127, 29, 29); // Dark red
  const disclaimerText = doc.splitTextToSize(insightData.insights.disclaimer, pageWidth - 28);
  doc.text(disclaimerText, 14, yPosition);
  
  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `AI-Powered Health Insights - Page ${i} of ${totalPages} - This is not a medical diagnosis`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};

export const getPDFBlob = (doc: jsPDF): Blob => {
  return doc.output('blob');
};

export const getPDFDataURL = (doc: jsPDF): string => {
  return doc.output('dataurlstring');
};
