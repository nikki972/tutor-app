import { useEffect, useState } from 'react'
import { getStudents, addStudent, updateStudent, deleteStudent } from '../db/students'

export default function Students() {
  const [students, setStudents] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    id: null, name: '', subject: 'Математика', price: '', grade: ''
  })

  useEffect(() => { load() }, [])

  async function load() {
    setStudents(await getStudents())
  }

  async function save() {
    if (!form.name || !form.price) return
    const data = { ...form, price: Number(form.price), id: form.id ?? Date.now() }
    form.id ? await updateStudent(data) : await addStudent(data)
    setForm({ id: null, name: '', subject: 'Математика', price: '', grade: '' })
    setOpen(false)
    load()
  }

  function edit(s) {
    setForm(s)
    setOpen(true)
  }

  async function remove(id) {
    await deleteStudent(id)
    load()
  }

  return (
    <div className="screen">
      <h1>Ученики</h1>

      <button onClick={() => setOpen(o => !o)}>＋ Добавить ученика</button>

      {open && (
        <div className="card">
          <input placeholder="Имя" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <select value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}>
            <option>Математика</option>
            <option>Физика</option>
          </select>
          <input type="number" placeholder="Цена, ₽" value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })} />
          <input placeholder="Класс" value={form.grade}
            onChange={e => setForm({ ...form, grade: e.target.value })} />
          <button onClick={save}>Сохранить</button>
        </div>
      )}

      {students.map(s => (
        <div key={s.id} className="card row">
          <div onClick={() => edit(s)}>
            <strong>{s.name}</strong>
            <div className="muted">{s.subject}, {s.grade} — {s.price} ₽</div>
          </div>
          <button onClick={() => remove(s.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}