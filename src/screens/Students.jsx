import { useEffect, useState } from 'react'
import {
  getStudents,
  addStudent,
  updateStudent,
  removeStudent,
} from '../db/students'
import { getAllLessons } from '../db/lessons'

const STATUS_LABELS = {
  active: 'Активен',
  paused: 'Пауза',
  finished: 'Завершён',
}

export default function Students() {
  const [students, setStudents] = useState([])
  const [lessons, setLessons] = useState([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    refresh()
    getAllLessons().then(setLessons)
  }, [])

  function refresh() {
    getStudents().then(setStudents)
  }

  function add() {
    const name = prompt('Имя ученика')
    if (name) {
      addStudent({ name }).then(refresh)
    }
  }

  function open(student) {
    setSelected(student)
  }

  function saveStudent(patch) {
    updateStudent(selected.id, patch).then(() => {
      refresh()
      setSelected(null)
    })
  }

  function studentLessons(name) {
    return lessons.filter(l => l.studentName === name)
  }

  const list =
    filter === 'all'
      ? students
      : students.filter(s => s.status === filter)

  return (
    <div className="screen">
      <h1>Ученики</h1>

      <div className="row">
        <button onClick={add}>+ Ученик</button>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Все</option>
          <option value="active">Активные</option>
          <option value="paused">Пауза</option>
          <option value="finished">Завершённые</option>
        </select>
      </div>

      <div className="list">
        {list.map(s => (
          <div key={s.id} className="card clickable" onClick={() => open(s)}>
            <b>{s.name}</b>
            <div className="muted">{STATUS_LABELS[s.status]}</div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal">
          <div className="card">
            <h3>{selected.name}</h3>

            <label>Статус</label>
            <select
              value={selected.status}
              onChange={e =>
                setSelected({ ...selected, status: e.target.value })
              }
            >
              <option value="active">Активен</option>
              <option value="paused">Пауза</option>
              <option value="finished">Завершён</option>
            </select>

            <label>Заметки</label>
            <textarea
              rows="4"
              value={selected.notes || ''}
              onChange={e =>
                setSelected({ ...selected, notes: e.target.value })
              }
            />

            <label>История занятий</label>
            <div className="history">
              {studentLessons(selected.name).length === 0 && (
                <div className="muted">Занятий нет</div>
              )}
              {studentLessons(selected.name).map(l => (
                <div key={l.id}>
                  {l.date} — {l.subject} — {l.price} ₽
                </div>
              ))}
            </div>

            <div className="row">
              <button onClick={() => saveStudent(selected)}>Сохранить</button>
              <button
                className="danger"
                onClick={() => {
                  if (confirm('Удалить ученика?')) {
                    removeStudent(selected.id).then(() => {
                      refresh()
                      setSelected(null)
                    })
                  }
                }}
              >
                Удалить
              </button>
              <button onClick={() => setSelected(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}