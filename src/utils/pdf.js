import { jsPDF } from 'jspdf'
import { getLessons } from '../db/lessons'

function isSameWeek(a, b) {
  const startOfWeek = d => {
    const date = new Date(d)
    const day = date.getDay() || 7
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - day + 1)
    return date
  }

  return +startOfWeek(a) === +startOfWeek(b)
}

export async function exportWeekPDF() {
  const lessons = await getLessons()
  const now = new Date()

  const doc = new jsPDF()
  let y = 10

  doc.setFontSize(14)
  doc.text('Отчёт за неделю', 10, y)
  y += 10

  doc.setFontSize(10)

  lessons
    .filter(l => l.date && isSameWeek(new Date(l.date), now))
    .forEach(l => {
      const line = `${l.date} — ${l.student || ''} — ${l.price || 0} ₽`
      doc.text(line, 10, y)
      y += 6
    })

  doc.save('week-report.pdf')
}