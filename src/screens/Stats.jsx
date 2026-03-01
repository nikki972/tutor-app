import { useEffect, useState } from 'react'
import { getLessons } from '../db/lessons'

/* ---------- helpers (локально, без импортов) ---------- */

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameWeek(a, b) {
  const startOfWeek = d => {
    const date = new Date(d)
    const day = date.getDay() || 7
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - day + 1)
    return date
  }

  return +startOfWeek(a) === +startOfWeek(b)
}

function isSameMonth(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  )
}

/* ----------------------------------------------------- */

const PERIODS = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
}

export default function Stats() {
  const [period, setPeriod] = useState('week')
  const [plan, setPlan] = useState(0)
  const [fact, setFact] = useState(0)

  useEffect(() => {
    calculate()
  }, [period])

  async function calculate() {
    const lessons = await getLessons()
    const now = new Date()

    let planSum = 0
    let factSum = 0

    for (const l of lessons) {
      if (!l.date || !l.price) continue

      const d = new Date(l.date)

      const inPeriod =
        period === 'day'
          ? isSameDay(d, now)
          : period === 'week'
          ? isSameWeek(d, now)
          : isSameMonth(d, now)

      if (!inPeriod) continue

      if (l.status === 'planned') {
        planSum += Number(l.price)
      }

      if (l.status === 'done') {
        factSum += Number(l.price)
      }
    }

    setPlan(planSum)
    setFact(factSum)
  }

  return (
    <div className="screen">
      <h2>Статистика</h2>

      <div className="segmented">
        {Object.entries(PERIODS).map(([key, label]) => (
          <button
            key={key}
            className={period === key ? 'active' : ''}
            onClick={() => setPeriod(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="stats-cards">
        <div className="stat-card plan">
          <div className="label">План</div>
          <div className="value">{plan} ₽</div>
        </div>

        <div className="stat-card fact">
          <div className="label">Факт</div>
          <div className="value">{fact} ₽</div>
        </div>
      </div>

      <div className="chart">
        <div
          className="bar plan"
          style={{ height: `${Math.max(plan / 100, 6)}px` }}
        >
          План
        </div>
        <div
          className="bar fact"
          style={{ height: `${Math.max(fact / 100, 6)}px` }}
        >
          Факт
        </div>
      </div>
    </div>
  )
}