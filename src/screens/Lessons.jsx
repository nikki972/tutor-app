import { useEffect, useState } from 'react'
import {
  getLessonsByDate,
  addLesson,
  deleteLesson,
  updateLesson,
} from '../db/lessons'
import { getStudents } from '../db/students'
import { getWeekDates } from '../utils/dates'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function shiftDate(dateStr, delta) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + delta)
  return d.toISOString().slice(0, 10)
}

export default function Lessons() {
  const [date, setDate] = useState(todayISO())
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])

  const [studentId, setStudentId] = useState('')
  const [time, setTime] = useState('')
  const [repeatWeekly, setRepeatWeekly] = useState(false)

  const week = getWeekDates(date)

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
      status: 'planned', // planned | done | canceled
      payment: 'unpaid', // paid | unpaid
      isRecurring: repeatWeekly,
      recurringRule: repeatWeekly
        ? { weekday: new Date(date).getDay() }
        : null,
    })

    setStudentId('')
    setTime('')
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

      {/* Недельный календарь */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {week.map(d => (
          <button
            key={d}
            onClick={() => setDate(d)}
            style={{
              flex: 1,
              fontWeight: d === date ? '600' : '400',
            }}
          >
            {d.slice(5)}
          </button>
        ))}
      </div>

      {/* Навигация по дням */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setDate(d => shiftDate(d, -1))}>◀</button>
        <strong style={{ margin: '0 12px' }}>{date}</strong>
        <button onClick={() => setDate(d => shiftDate(d, 1))}>▶</button>
      </div>

      {/* Добавление урока */}
      <div className="card">
        <select
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
        >
          <option value="">Ученик</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
        />

        <label style={{ marginLeft: 8 }}>
          <input
            type="checkbox"
            checked={repeatWeekly}
            onChange={e => setRepeatWeekly(e.target.checked)}
          />{' '}
          каждую неделю
        </label>

        <div style={{ marginTop: 8 }}>
          <button onClick={handleAdd}>Добавить занятие</button>
        </div>
      </div>

      {/* Список уроков */}
      {lessons.length === 0 && (
        <p className="muted">Занятий на этот день нет</p>
      )}

      {lessons.map(l => (
        <div
          key={l.id}
          className={`card status-${l.status}`}
        >
          <div style={{ marginBottom: 6 }}>
            <strong>{l.time}</strong> — {l.studentName}
            {l.isRecurring && ' 🔁'}
          </div>

          <div className="muted" style={{ marginBottom: 8 }}>
            {l.subject}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* Статус занятия */}
            <select
              value={l.status}
              onChange={e =>
                update(l.id, { status: e.target.value })
              }
            >
              <option value="planned">Запланировано</option>
              <option value="done">Проведено</option>
              <option value="canceled">Отменено</option>
            </select>

            {/* Статус оплаты */}
            <select
              value={l.payment}
              onChange={e =>
                update(l.id, { payment: e.target.value })
              }
            >
              <option value="unpaid">Не оплачено</option>
              <option value="paid">Оплачено</option>
            </select>

            {/* Цена занятия */}
            <input
              type="number"
              value={l.price}
              onChange={e =>
                update(l.id, { price: Number(e.target.value) })
              }
              style={{ width: 80 }}
            />
            <span>₽</span>

            <button onClick={() => remove(l.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}