import { useEffect, useState } from 'react'
import { getStudents, addStudent, deleteStudent } from '../db/students'

export default function Students() {
  const [students, setStudents] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    const data = await getStudents()
    setStudents(data)
  }

  async function handleAdd() {
    if (!name.trim()) return

    const student = {
      id: Date.now(),
      name,
      subject: 'Математика',
      price: 0,
      grade: '',
      textbook: '',
    }

    await addStudent(student)
    setName('')
    loadStudents()
  }

  async function handleDelete(id) {
    await deleteStudent(id)
    loadStudents()
  }

  return (
    <div className="screen">
      <h1>Ученики</h1>

      <div style={{ marginBottom: 16 }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Имя ученика"
        />
        <button onClick={handleAdd}>Добавить</button>
      </div>

      {students.length === 0 && <p>Ученики не добавлены</p>}

      {students.map(s => (
        <div
          key={s.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span>{s.name}</span>
          <button onClick={() => handleDelete(s.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}