import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export async function generateCvPdf(
  elementId: string,
  filename = 'Christelle_Mamekem_Ngueguim_CV.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element #${elementId} not found`);
  }

  // skipFonts: true and fontEmbedCSS: '' prevent cross-origin stylesheet CORS errors
  // when accessing external stylesheets like Google Fonts (sheet.cssRules)
  const imgData = await toPng(element, {
    quality: 0.98,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    cacheBust: true,
    skipFonts: true,
    fontEmbedCSS: '',
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
}
