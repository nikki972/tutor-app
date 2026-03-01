import { useEffect, useState } from 'react'
import { getLessonsByDate, addLesson, updateLesson, deleteLesson } from '../db/lessons'
import { getStudents } from '../db/students'
import { getWeekDates } from '../utils/dates'
import { findFreeTime, hasConflict } from '../utils/schedule'

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function Lessons() {
  const [date, setDate] = useState(todayISO())
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [time, setTime] = useState('')
  const [clientView, setClientView] = useState(false)

  const week = getWeekDates(date)

  useEffect(() => { load() }, [date])

  async function load() {
    const [ls, st] = await Promise.all([
      getLessonsByDate(date),
      getStudents()
    ])
    setLessons(ls.sort((a, b) => a.time.localeCompare(b.time)))
    setStudents(st)
    setTime(findFreeTime(ls))
  }

  async function add() {
    if (!studentId || !time) return
    if (hasConflict(time, lessons)) {
      alert('Конфликт по времени')
      return
    }
    const s = students.find(x => x.id === Number(studentId))
    await addLesson({
      id: Date.now(),
      date, time,
      studentId: s.id,
      studentName: s.name,
      subject: s.subject,
      price: s.price,
      status: 'planned',
      payment: 'unpaid'
    })
    load()
  }

  async function patch(id, p) {
    const l = lessons.find(x => x.id === id)
    await updateLesson({ ...l, ...p })
    load()
  }

  async function copy(l) {
    await addLesson({ ...l, id: Date.now(), date })
    load()
  }

  return (
    <div className="screen">
      <h1>Уроки</h1>

      <label>
        <input type="checkbox"
          checked={clientView}
          onChange={() => setClientView(v => !v)} />
        Режим показа клиенту
      </label>

      <div className="week">
        {week.map(d => (
          <div key={d}
            className="week-day"
            data-active={d === date}
            onClick={() => setDate(d)}>
            {new Date(d).getDate()}
          </div>
        ))}
      </div>

      <div className="card add-row">
        <select value={studentId} onChange={e => setStudentId(e.target.value)}>
          <option value="">Ученик</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <button onClick={add}>+</button>
      </div>

      {lessons.map(l => (
        <div key={l.id}
          className={`card lesson-swipe status-${l.status}`}
          onTouchStart={e => l._x = e.touches[0].clientX}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - l._x
            if (dx > 80) patch(l.id, { status: 'done' })
            if (dx < -80) patch(l.id, { status: 'canceled' })
          }}>

          <div className="lesson-main">
            <strong>{l.time} — {l.studentName}</strong>
            <div className="muted">{l.subject}</div>
          </div>

          {!clientView &&
            <div className="lesson-actions">
              {l.status !== 'done' &&
                <button onClick={() => patch(l.id, { status: 'done' })}>✔</button>}
              {l.payment !== 'paid' &&
                <button onClick={() => patch(l.id, { payment: 'paid' })}>💰</button>}
              <button onClick={() => copy(l)}>⧉</button>
              <span>{l.price} ₽</span>
              <button onClick={() => deleteLesson(l.id)}>✕</button>
            </div>}
        </div>
      ))}
    </div>
  )
}