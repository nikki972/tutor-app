import { db } from './index'
import { getWeekday } from '../utils/dates'

const STORE = 'lessons'

export async function getLessons() {
  return (await db.getAll(STORE)) || []
}

export async function getLessonsByDate(date) {
  const all = await getLessons()
  return all.filter(l => l.date === date)
}

export async function addLesson(lesson) {
  return db.put(STORE, {
    ...lesson,
    status: lesson.status || 'planned', // planned | done | canceled
    createdAt: Date.now(),
  })
}

export async function updateLesson(id, patch) {
  const lesson = await db.get(STORE, id)
  if (!lesson) return
  return db.put(STORE, { ...lesson, ...patch })
}

export async function removeLesson(id) {
  return db.delete(STORE, id)
}

/**
 * Используется для автогенерации повторов
 */
export async function generateWeeklyLessons(baseLesson, weeks = 4) {
  const lessons = []

  for (let i = 1; i <= weeks; i++) {
    const date = new Date(baseLesson.date)
    date.setDate(date.getDate() + i * 7)

    lessons.push({
      ...baseLesson,
      id: undefined,
      date: date.toISOString().slice(0, 10),
      weekday: getWeekday(date),
      status: 'planned',
      createdAt: Date.now(),
    })
  }

  for (const lesson of lessons) {
    await db.put(STORE, lesson)
  }
}