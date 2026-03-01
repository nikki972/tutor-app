import { openDB } from 'idb'

export const db = await openDB('tutor-db', 3, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('students')) {
      db.createObjectStore('students', { keyPath: 'id', autoIncrement: true })
    }

    if (!db.objectStoreNames.contains('lessons')) {
      db.createObjectStore('lessons', { keyPath: 'id', autoIncrement: true })
    }

    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'key' })
    }
  },
})