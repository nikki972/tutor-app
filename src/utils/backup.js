import { getLessons } from '../db/lessons'
import { getStudents } from '../db/students'

export async function exportBackup() {
  const lessons = await getLessons()
  const students = await getStudents()

  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    students,
    lessons,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = `backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}