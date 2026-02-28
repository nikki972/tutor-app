import { useEffect, useState } from 'react'
import { getAllLessons } from '../db/lessons'
import { calcFact, calcPlan } from '../utils/stats'

export default function Stats() {
  const [data, setData] = useState({})

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const all = await getAllLessons()
    const now = new Date()

    const by = fn => all.filter(l => fn(new Date(l.date)))

    const sameDay = d => d.toDateString() === now.toDateString()
    const sameWeek = d => (now - d) / 86400000 < 7
    const sameMonth = d =>
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()

    setData({
      day: by(sameDay),
      week: by(sameWeek),
      month: by(sameMonth),
    })
  }

  return (
    <div className="screen">
      <h1>Статистика</h1>

      {['day', 'week', 'month'].map(k => (
        <div key={k} className="card">
          <strong>{k === 'day' ? 'День' : k === 'week' ? 'Неделя' : 'Месяц'}</strong>
          <div className="muted">
            Факт: {calcFact(data[k] || [])} ₽
          </div>
          <div className="muted">
            План: {calcPlan(data[k] || [])} ₽
          </div>
        </div>
      ))}
    </div>
  )
}