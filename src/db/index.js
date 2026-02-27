import { openDB } from 'idb'

export const dbPromise = openDB('TutorAppDB', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('students')) {
      db.createObjectStore('students', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('lessons')) {
      db.createObjectStore('lessons', { keyPath: 'id' })
    }
  },
})