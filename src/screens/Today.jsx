import { useEffect, useState } from 'react'
import { getLessonsByDate, updateLesson } from '../db/lessons'

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function Today() {
  const [lessons, setLessons] = useState([])
  const today = todayISO()

  useEffect(() => { load() }, [])

  async function load() {
    setLessons(await getLessonsByDate(today))
  }

  const done = lessons.filter(l => l.status === 'done').length
  const left = lessons.filter(l => l.status === 'planned').length
  const paid = lessons.filter(l => l.payment === 'paid')
    .reduce((s, l) => s + l.price, 0)

  async function quick(id, patch) {
    const l = lessons.find(x => x.id === id)
    await updateLesson({ ...l, ...patch })
    load()
  }

  return (
    <div className="screen">
      <h1>Сегодня</h1>

      <div className="card">
        <div>Проведено: <b>{done}</b></div>
        <div>Осталось: <b>{left}</b></div>
        <div>Доход: <b>{paid} ₽</b></div>
      </div>

      {lessons.map(l => (
        <div key={l.id} className="card lesson-swipe">
          <div className="lesson-main">
            <strong>{l.time} — {l.studentName}</strong>
            <div className="muted">{l.subject}</div>
          </div>

          <div className="lesson-actions">
            {l.status !== 'done' &&
              <button onClick={() => quick(l.id, { status: 'done' })}>✔</button>}
            {l.payment !== 'paid' &&
              <button onClick={() => quick(l.id, { payment: 'paid' })}>💰</button>}
          </div>
        </div>
      ))}
    </div>
  )
}