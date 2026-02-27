import { useEffect, useState } from 'react'
import {
  getLessonsByDate,
  addLesson,
  deleteLesson,
  updateLesson,
} from '../db/lessons'
import { getStudents } from '../db/students'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Lessons() {
  const [date, setDate] = useState(todayISO())
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [time, setTime] = useState('')
  const [repeatWeekly, setRepeatWeekly] = useState(false)

  useEffect(() => {
    load()
  }, [date])

  async function load() {
    const [ls, st] = await Promise.all([
      getLessonsByDate(date),
      getStudents(),
    ])
    setLessons(ls.sort((a, b) => a.time.localeCompare(b.time)))
    setStudents(st)
  }

  async function handleAdd() {
    if (!studentId || !time) return
    const student = students.find(s => s.id === Number(studentId))
    if (!student) return

    await addLesson({
      id: Date.now(),
      date,
      time,
      studentId: student.id,
      studentName: student.name,
      subject: student.subject,
      price: student.price,
      status: 'planned',
      payment: 'unpaid',
      isRecurring: repeatWeekly,
      recurringRule: repeatWeekly
        ? { weekday: new Date(date).getDay() }
        : null,
    })

    setTime('')
    setStudentId('')
    setRepeatWeekly(false)
    load()
  }

  async function update(id, patch) {
    const lesson = lessons.find(l => l.id === id)
    if (!lesson) return
    await updateLesson({ ...lesson, ...patch })
    load()
  }

  async function remove(id) {
    await deleteLesson(id)
    load()
  }

  return (
    <div className="screen">
      <h1>Уроки</h1>

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setDate(d => shiftDate(d, -1))}>◀</button>
        <strong style={{ margin: '0 8px' }}>{date}</strong>
        <button onClick={() => setDate(d => shiftDate(d, 1))}>▶</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <select value={studentId} onChange={e => setStudentId(e.target.value)}>
          <option value="">Ученик</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input type="time" value={time} onChange={e => setTime(e.target.value)} />

        <label style={{ marginLeft: 8 }}>
          <input
            type="checkbox"
            checked={repeatWeekly}
            onChange={e => setRepeatWeekly(e.target.checked)}
          />
          каждую неделю
        </label>

        <button onClick={handleAdd}>Добавить</button>
      </div>

      {lessons.length === 0 && <p>Занятий нет</p>}

      {lessons.map(l => (
        <div key={l.id} style={{ borderBottom: '1px solid #ddd', padding: 8 }}>
          <div>
            <strong>{l.time}</strong> — {l.studentName}
            {l.isRecurring && ' 🔁'}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <select
              value={l.status}
              onChange={e => update(l.id, { status: e.target.value })}
            >
              <option value="planned">Запланировано</option>
              <option value="done">Проведено</option>
              <option value="canceled">Отменено</option>
            </select>

            <select
              value={l.payment}
              onChange={e => update(l.id, { payment: e.target.value })}
            >
              <option value="unpaid">Не оплачено</option>
              <option value="paid">Оплачено</option>
            </select>

            <span>{l.price} ₽</span>
            <button onClick={() => remove(l.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function shiftDate(dateStr, delta) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + delta)
  return d.toISOString().slice(0, 10)
}