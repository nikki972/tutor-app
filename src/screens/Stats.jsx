import { useEffect, useState } from 'react'
import { getAllLessons } from '../db/lessons'
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  calcFact,
  calcPlan,
} from '../utils/stats'

function Bar({ label, fact, plan }) {
  const max = Math.max(fact, plan, 1)
  const factW = Math.round((fact / max) * 100)
  const planW = Math.round((plan / max) * 100)

  return (
    <div className="card">
      <strong>{label}</strong>

      <div className="bar-wrap">
        <div className="bar plan" style={{ width: `${planW}%` }}>
          План: {plan} ₽
        </div>
      </div>

      <div className="bar-wrap">
        <div className="bar fact" style={{ width: `${factW}%` }}>
          Факт: {fact} ₽
        </div>
      </div>
    </div>
  )
}

export default function Stats() {
  const [data, setData] = useState({
    day: { fact: 0, plan: 0 },
    week: { fact: 0, plan: 0 },
    month: { fact: 0, plan: 0 },
  })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const all = await getAllLessons()
    const now = new Date()

    const dayLessons = all.filter(l =>
      isSameDay(new Date(l.date), now)
    )
    const weekLessons = all.filter(l =>
      isSameWeek(new Date(l.date), now)
    )
    const monthLessons = all.filter(l =>
      isSameMonth(new Date(l.date), now)
    )

    setData({
      day: {
        fact: calcFact(dayLessons),
        plan: calcPlan(dayLessons),
      },
      week: {
        fact: calcFact(weekLessons),
        plan: calcPlan(weekLessons),
      },
      month: {
        fact: calcFact(monthLessons),
        plan: calcPlan(monthLessons),
      },
    })
  }

  return (
    <div className="screen">
      <h1>Статистика</h1>

      <Bar
        label="Сегодня"
        fact={data.day.fact}
        plan={data.day.plan}
      />

      <Bar
        label="Неделя"
        fact={data.week.fact}
        plan={data.week.plan}
      />

      <Bar
        label="Месяц"
        fact={data.month.fact}
        plan={data.month.plan}
      />
    </div>
  )
}