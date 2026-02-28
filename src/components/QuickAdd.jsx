import { useEffect, useState } from 'react'
import { addLesson } from '../db/lessons'
import { getStudents } from '../db/students'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function nextTimeSlot() {
  const d = new Date()
  d.setMinutes(d.getMinutes() + 30)
  return d.toTimeString().slice(0, 5)
}

export default function QuickAdd({ onClose }) {
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [time, setTime] = useState(nextTimeSlot())

  useEffect(() => {
    getStudents().then(setStudents)
  }, [])

  async function save() {
    if (!studentId || !time) return
    const s = students.find(x => x.id === Number(studentId))
    if (!s) return

    await addLesson({
      id: Date.now(),
      date: todayISO(),
      time,
      studentId: s.id,
      studentName: s.name,
      subject: s.subject,
      price: s.price,
      status: 'planned',
      payment: 'unpaid',
      isRecurring: false,
      recurringRule: null,
    })

    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Быстро добавить</h3>

        <select
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
        >
          <option value="">Ученик</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={save}>Добавить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  )
}