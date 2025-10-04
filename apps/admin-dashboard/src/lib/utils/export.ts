import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(
  data: any[],
  columns: { header: string; dataKey: string }[],
  filename: string,
  title: string
) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 22);

  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: data.map((row) => columns.map((col) => row[col.dataKey] || '')),
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [234, 88, 12] }, // Orange color
  });

  doc.save(`${filename}.pdf`);
}

export function exportToExcel(data: any[], filename: string) {
  // For Excel export, we'll use CSV format as a simple solution
  // In production, consider using libraries like xlsx or exceljs
  exportToCSV(data, filename);
}
