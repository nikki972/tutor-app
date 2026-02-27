import { useEffect, useState } from 'react'
import { getAllLessons } from '../db/lessons'

export default function Archive() {
  const [lessons, setLessons] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const all = await getAllLessons()
    const today = new Date().toISOString().slice(0, 10)
    setLessons(all.filter(l => l.date < today))
  }

  return (
    <div className="screen">
      <h1>Архив</h1>

      {lessons.length === 0 && <p>Архив пуст</p>}

      {lessons.map(l => (
        <div key={l.id} style={{ borderBottom: '1px solid #ddd', padding: 8 }}>
          <div>
            {l.date} {l.time} — {l.studentName}
          </div>
          <div>
            {l.status} / {l.payment} / {l.price} ₽
          </div>
        </div>
      ))}
    </div>
  )
}