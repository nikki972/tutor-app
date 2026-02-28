import { dbPromise } from '../db'

export async function exportBackup() {
  const db = await dbPromise
  const students = await db.getAll('students')
  const lessons = await db.getAll('lessons')

  const data = {
    version: 1,
    date: new Date().toISOString(),
    students,
    lessons,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'tutor-backup.json'
  a.click()
}

export async function importBackup(file) {
  const text = await file.text()
  const data = JSON.parse(text)

  const db = await dbPromise
  const tx = db.transaction(['students', 'lessons'], 'readwrite')

  await Promise.all(
    data.students.map(s => tx.objectStore('students').put(s))
  )
  await Promise.all(
    data.lessons.map(l => tx.objectStore('lessons').put(l))
  )

  await tx.done
}