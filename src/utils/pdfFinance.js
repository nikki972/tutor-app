import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportFinancePDF() {
  const el = document.getElementById('finance-report')
  if (!el) return

  const canvas = await html2canvas(el, { scale: 2 })
  const img = canvas.toDataURL('image/png')

  const pdf = new jsPDF('p', 'mm', 'a4')
  const w = 210
  const h = (canvas.height * w) / canvas.width

  pdf.addImage(img, 'PNG', 0, 0, w, h)
  pdf.save('finance-report.pdf')
}