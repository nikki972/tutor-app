import { dbPromise } from './index'

export async function getStudents() {
  const db = await dbPromise
  return db.getAll('students')
}

export async function addStudent(student) {
  const db = await dbPromise
  return db.put('students', student)
}

export async function updateStudent(student) {
  const db = await dbPromise
  return db.put('students', student)
}

export async function deleteStudent(id) {
  const db = await dbPromise
  return db.delete('students', id)
}