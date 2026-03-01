import { jsPDF } from 'jspdf'
import { getLessons } from '../db/lessons'

export async function exportWeekPDF() {
  const lessons = await getLessons()
  const pdf = new jsPDF()

  pdf.text('Lessons', 10, 10)

  lessons.forEach((l, i) => {
    pdf.text(`${l.date} — ${l.title || ''}`, 10, 20 + i * 8)
  })

  pdf.save('lessons.pdf')
}