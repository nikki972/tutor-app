import { openDB } from 'idb'

const DB_NAME = 'school-db'
const STORE = 'students'

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: 'id' })
    }
  },
})

export async function getStudents() {
  const db = await dbPromise
  return db.getAll(STORE)
}

export async function addStudent(student) {
  const db = await dbPromise
  await db.put(STORE, student)
}

export async function updateStudent(student) {
  const db = await dbPromise
  await db.put(STORE, student)
}

export async function removeStudent(id) {
  const db = await dbPromise
  await db.delete(STORE, id)
}