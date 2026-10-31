import { jsPDF } from 'jspdf';
import { RecommendationResponse, RecommendationInput } from '@agrosmart/shared';

export function exportRecommendationPDF(data: RecommendationResponse) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Banner
  doc.setFillColor(46, 125, 50); // Agro Green
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AgroSmart AI – Crop Recommendation Advisory Report', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Problem ID: HACK-P302 • Scientific Precision Farming Advisory Guidance', 14, 21);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | ID: ${data.requestId}`, pageWidth - 14, 21, { align: 'right' });

  y = 36;

  // Section 1: Field Parameters & Soil Measurements
  doc.setTextColor(20, 83, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Farm Plot & Field Measurements', 14, y);
  y += 6;

  doc.setFillColor(248, 250, 245);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const inp = data.inputSummary;
  const col1 = 18;
  const col2 = 80;
  const col3 = 140;

  doc.text(`Soil Texture: ${inp.soilType || 'Unspecified'}`, col1, y + 7);
  doc.text(`Soil pH: ${inp.soilPh ?? 'Unspecified'}`, col1, y + 14);
  doc.text(`Cultivation Season: ${inp.season || 'Unspecified'}`, col1, y + 21);

  doc.text(`Temperature: ${inp.temperature ? `${inp.temperature}°C` : 'Unspecified'}`, col2, y + 7);
  doc.text(`Precipitation: ${inp.rainfall ? `${inp.rainfall} mm` : 'Unspecified'}`, col2, y + 14);
  doc.text(`Relative Humidity: ${inp.humidity ? `${inp.humidity}%` : 'Unspecified'}`, col2, y + 21);

  doc.text(`Nitrogen (N): ${inp.nitrogen ?? 'Not tested'} kg/ha`, col3, y + 7);
  doc.text(`Phosphorus (P): ${inp.phosphorus ?? 'Not tested'} kg/ha`, col3, y + 14);
  doc.text(`Potassium (K): ${inp.potassium ?? 'Not tested'} kg/ha`, col3, y + 21);

  y += 38;

  // Section 2: Top Ranked Recommendations
  doc.setTextColor(20, 83, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Top Recommended Crops (Evaluated by Weighted Multi-Factor Engine)', 14, y);
  y += 6;

  const topCrops = data.recommendations.slice(0, 5);

  topCrops.forEach((r, idx) => {
    // Check page overflow
    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(idx === 0 ? 232 : 255, idx === 0 ? 245 : 255, idx === 0 ? 233 : 255);
    doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'S');

    // Rank & Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 83, 45);
    doc.text(`#${r.rank}  ${r.crop.name} (${r.crop.scientificName})`, 18, y + 7);

    // Score Badge
    doc.setFontSize(12);
    doc.setTextColor(46, 125, 50);
    doc.text(`${r.suitabilityScore}% Match`, pageWidth - 20, y + 7, { align: 'right' });

    // Category
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${r.crop.category} • Season: ${r.crop.seasons.join(', ')} • Water Need: ${r.crop.waterRequirement}`, 18, y + 13);

    // Summary text
    doc.setTextColor(51, 65, 85);
    const summaryLines = doc.splitTextToSize(r.explanation.summary, pageWidth - 40);
    doc.text(summaryLines[0] || '', 18, y + 19);

    y += 30;
  });

  // Section 3: Advisory Disclaimer & Sources
  if (y > 235) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(254, 243, 199); // Soft amber
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14);
  doc.text('ADVISORY NOTICE & METHODOLOGICAL LIMITATION:', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  const disclaimerText = 'AgroSmart AI recommendations are scientific decision-support guidelines derived from published ICAR and FAO EcoCrop suitability ranges. They represent probabilistic suitability, not guaranteed harvest yield. Always evaluate localized micro-watersheds and consult district Krishi Vigyan Kendra (KVK) agronomists.';
  const disLines = doc.splitTextToSize(disclaimerText, pageWidth - 36);
  doc.text(disLines, 18, y + 12);

  y += 32;

  // Footer on page
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('AgroSmart AI • Problem ID: HACK-P302 • Grow Smarter, Farm Better.', pageWidth / 2, 290, { align: 'center' });

  // Save the PDF
  doc.save(`AgroSmart_AI_Recommendation_${data.requestId}.pdf`);
}
