import { dbPromise } from './index'
import { getWeekday } from '../utils/dates'

export async function getLessonsByDate(date) {
  const db = await dbPromise
  const all = await db.getAll('lessons')

  // 1. обычные уроки
  const normal = all.filter(l => l.date === date)

  // 2. повторы
  const weekday = getWeekday(date)

  const recurring = all.filter(
    l =>
      l.isRecurring &&
      l.recurringRule &&
      l.recurringRule.weekday === weekday &&
      l.date <= date // правило создано раньше
  )

  // создаём реальные уроки, если их ещё нет
  for (const r of recurring) {
    const exists = normal.find(
      n => n.studentId === r.studentId && n.time === r.time
    )
    if (!exists) {
      const instance = {
        ...r,
        id: Date.now() + Math.random(),
        date,
        isRecurring: false,
      }
      await db.put('lessons', instance)
      normal.push(instance)
    }
  }

  return normal
}

export async function getAllLessons() {
  const db = await dbPromise
  return db.getAll('lessons')
}

export async function addLesson(lesson) {
  const db = await dbPromise
  return db.put('lessons', lesson)
}

export async function updateLesson(lesson) {
  const db = await dbPromise
  return db.put('lessons', lesson)
}

export async function deleteLesson(id) {
  const db = await dbPromise
  return db.delete('lessons', id)
}