import { openDB } from 'idb'

const DB_NAME = 'school-db'
const STORE = 'lessons'

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: 'id' })
    }
  },
})

export async function getLessons() {
  const db = await dbPromise
  return db.getAll(STORE)
}

export async function getLessonsByDate(date) {
  const db = await dbPromise
  const all = await db.getAll(STORE)
  return all.filter(l => l.date === date)
}

export async function addLesson(lesson) {
  const db = await dbPromise
  await db.put(STORE, lesson)
}

export async function updateLesson(lesson) {
  const db = await dbPromise
  await db.put(STORE, lesson)
}

export async function deleteLesson(id) {
  const db = await dbPromise
  await db.delete(STORE, id)
}