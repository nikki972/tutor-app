import { useEffect, useState } from 'react'
import { getLessonsByDate, addLesson, updateLesson, deleteLesson } from '../db/lessons'
import { getStudents } from '../db/students'
import { getWeekDates } from '../utils/dates'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Lessons() {
  const [date, setDate] = useState(todayISO())
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [time, setTime] = useState('')

  const week = getWeekDates(date)

  useEffect(() => { load() }, [date])

  async function load() {
    const [ls, st] = await Promise.all([getLessonsByDate(date), getStudents()])
    setLessons(ls.sort((a, b) => a.time.localeCompare(b.time)))
    setStudents(st)
  }

  async function add() {
    if (!studentId || !time) return
    const s = students.find(x => x.id === Number(studentId))
    if (!s) return
    await addLesson({
      id: Date.now(),
      date, time,
      studentId: s.id,
      studentName: s.name,
      subject: s.subject,
      price: s.price,
      status: 'planned',
      payment: 'unpaid',
      isRecurring: false,
      recurringRule: null,
    })
    setStudentId('')
    setTime('')
    load()
  }

  async function patch(id, p) {
    const l = lessons.find(x => x.id === id)
    if (!l) return
    await updateLesson({ ...l, ...p })
    load()
  }

  async function remove(id) {
    await deleteLesson(id)
    load()
  }

  return (
    <div className="screen">
      <h1>Уроки</h1>

      <div className="week">
        {week.map(d => {
          const dt = new Date(d)
          return (
            <div key={d} className="week-day" data-active={d === date}
              onClick={() => setDate(d)}>
              {dt.toLocaleDateString('ru-RU', { weekday: 'short' })}
              <strong>{dt.getDate()}</strong>
            </div>
          )
        })}
      </div>

      <div className="card add-row">
        <select value={studentId} onChange={e => setStudentId(e.target.value)}>
          <option value="">Ученик</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <button onClick={add}>Добавить</button>
      </div>

      {lessons.map(l => (
        <div key={l.id} className={`card status-${l.status}`}>
          <div className="lesson-row">
            <div className="lesson-main">
              <strong>{l.time} — {l.studentName}</strong>
              <span className="muted">{l.subject}</span>
            </div>

            <div className="lesson-actions">
              <select value={l.status}
                onChange={e => patch(l.id, { status: e.target.value })}>
                <option value="planned">Запланировано</option>
                <option value="done">Проведено</option>
                <option value="canceled">Отменено</option>
              </select>

              <select value={l.payment}
                onChange={e => patch(l.id, { payment: e.target.value })}>
                <option value="unpaid">Не оплачено</option>
                <option value="paid">Оплачено</option>
              </select>

              <span>{l.price}₽</span>
              <button onClick={() => remove(l.id)}>✕</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}