import { jsPDF } from 'jspdf'
import { getAllLessons } from '../db/lessons'

export async function exportWeekPDF() {
  const doc = new jsPDF()
  const lessons = await getAllLessons()

  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay() + 1) // понедельник

  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  const weekLessons = lessons
    .filter(l => {
      const d = new Date(l.date)
      return d >= start && d <= end
    })
    .sort((a, b) =>
      a.date === b.date
        ? a.time.localeCompare(b.time)
        : a.date.localeCompare(b.date)
    )

  let y = 10
  doc.setFontSize(14)
  doc.text('Расписание недели', 10, y)
  y += 10

  let currentDate = ''

  for (const l of weekLessons) {
    if (l.date !== currentDate) {
      currentDate = l.date
      y += 6
      doc.setFontSize(12)
      doc.text(currentDate, 10, y)
      y += 6
    }

    doc.setFontSize(10)
    doc.text(`${l.time} — ${l.studentName} (${l.subject})`, 12, y)
    y += 5

    if (y > 280) {
      doc.addPage()
      y = 10
    }
  }

  doc.save('schedule-week.pdf')
}