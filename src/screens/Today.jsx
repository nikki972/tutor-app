import { useEffect, useState } from 'react'
import { getLessonsByDate, updateLesson } from '../db/lessons'
import { calcFact, calcPlan } from '../utils/stats'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Today() {
  const [lessons, setLessons] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const data = await getLessonsByDate(todayISO())
    setLessons(data.sort((a, b) => a.time.localeCompare(b.time)))
  }

  async function quickUpdate(id, patch) {
    const lesson = lessons.find(l => l.id === id)
    if (!lesson) return
    await updateLesson({ ...lesson, ...patch })
    load()
  }

  const fact = calcFact(lessons)
  const plan = calcPlan(lessons)

  return (
    <div className="screen">
      <h1>Сегодня</h1>

      <div className="card">
        <strong>Итого за день</strong>
        <div className="muted">Факт: {fact} ₽</div>
        <div className="muted">План: {plan} ₽</div>
      </div>

      {lessons.length === 0 && (
        <p className="muted">Сегодня занятий нет</p>
      )}

      {lessons.map(l => (
        <div key={l.id} className={`card status-${l.status}`}>
          <div style={{ marginBottom: 6 }}>
            <strong>{l.time}</strong> — {l.studentName}
            {l.payment === 'paid' && ' 💰'}
          </div>

          <div className="muted" style={{ marginBottom: 8 }}>
            {l.subject} · {l.price} ₽
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() =>
                quickUpdate(l.id, { status: 'done' })
              }
            >
              ✔ Проведено
            </button>

            <button
              onClick={() =>
                quickUpdate(l.id, { payment: 'paid' })
              }
            >
              💰 Оплачено
            </button>

            <button
              onClick={() =>
                quickUpdate(l.id, { status: 'canceled' })
              }
            >
              ❌ Отменено
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}