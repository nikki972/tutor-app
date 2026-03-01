import { useEffect, useState } from 'react'
import { getLessons } from '../db/lessons'

const STATUS_LABELS = {
  done: 'Проведено',
  canceled: 'Отменено',
  moved: 'Перенесено',
}

export default function Archive() {
  const [lessons, setLessons] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    getLessons().then(all => {
      const past = all.filter(l => l.status !== 'planned')
      setLessons(past)
    })
  }, [])

  const filtered = lessons.filter(l =>
    statusFilter === 'all' ? true : l.status === statusFilter
  )

  return (
    <div className="screen">
      <h2>Архив занятий</h2>

      <div className="filters">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">Все</option>
          <option value="done">Проведённые</option>
          <option value="canceled">Отменённые</option>
          <option value="moved">Перенесённые</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="empty">Нет занятий</div>
      )}

      {filtered.map(l => (
        <div key={l.id} className={`lesson-card ${l.status}`}>
          <div className="lesson-main">
            <div className="lesson-time">{l.date} {l.time}</div>
            <div className="lesson-student">{l.student}</div>
          </div>

          <div className="lesson-meta">
            <span>{l.subject}</span>
            <span>{l.price} ₽</span>
            <span className={`status ${l.status}`}>
              {STATUS_LABELS[l.status] || l.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}