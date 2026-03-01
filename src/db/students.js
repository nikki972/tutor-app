import { db } from './index'

const STORE = 'students'

export async function getStudents() {
  return (await db.getAll(STORE)) || []
}

export async function addStudent(student) {
  return db.put(STORE, {
    ...student,
    status: student.status || 'active',
    notes: student.notes || '',
    createdAt: Date.now(),
  })
}

export async function updateStudent(id, patch) {
  const student = await db.get(STORE, id)
  if (!student) return
  return db.put(STORE, { ...student, ...patch })
}

export async function removeStudent(id) {
  return db.delete(STORE, id)
}