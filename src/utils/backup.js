import { getLessons } from '../db/lessons'
import { getStudents, addStudent } from '../db/students'
import { addLesson } from '../db/lessons'

export async function exportBackup() {
  const lessons = await getLessons()
  const students = await getStudents()

  const data = {
    version: 1,
    createdAt: new Date().toISOString(),
    lessons,
    students,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'backup.json'
  a.click()
  URL.revokeObjectURL(url)
}

export async function importBackup(file) {
  const text = await file.text()
  const data = JSON.parse(text)

  if (!data.lessons || !data.students) {
    throw new Error('Invalid backup file')
  }

  for (const student of data.students) {
    await addStudent(student)
  }

  for (const lesson of data.lessons) {
    await addLesson(lesson)
  }
}