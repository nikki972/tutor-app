import { useEffect, useState } from 'react'
import { getAllLessons } from '../db/lessons'
import { calcIncome } from '../utils/stats'

export default function Stats() {
  const [day, setDay] = useState(0)
  const [week, setWeek] = useState(0)
  const [month, setMonth] = useState(0)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const all = await getAllLessons()
    const now = new Date()

    const isSameDay = d => d === now.toISOString().slice(0, 10)

    const isSameWeek = d => {
      const dt = new Date(d)
      const diff = (now - dt) / (1000 * 60 * 60 * 24)
      return diff >= 0 && diff < 7
    }

    const isSameMonth = d => {
      const dt = new Date(d)
      return (
        dt.getMonth() === now.getMonth() &&
        dt.getFullYear() === now.getFullYear()
      )
    }

    setDay(calcIncome(all.filter(l => isSameDay(l.date))))
    setWeek(calcIncome(all.filter(l => isSameWeek(l.date))))
    setMonth(calcIncome(all.filter(l => isSameMonth(l.date))))
  }

  return (
    <div className="screen">
      <h1>Статистика</h1>

      <p>Сегодня: {day} ₽</p>
      <p>Неделя: {week} ₽</p>
      <p>Месяц: {month} ₽</p>
    </div>
  )
}