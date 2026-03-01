import { useEffect, useState } from 'react'
import { getAllLessons } from '../db/lessons'
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  calcFact,
  calcPlan,
} from '../utils/stats'
import {
  calcAverageCheck,
  calcDebtByStudent,
  incomeBySubject,
} from '../utils/finance'
import { exportFinancePDF } from '../utils/pdfFinance'

function Section({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default function Stats() {
  const [lessons, setLessons] = useState([])
  const now = new Date()

  useEffect(() => {
    getAllLessons().then(setLessons)
  }, [])

  const day = lessons.filter(l => isSameDay(new Date(l.date), now))
  const week = lessons.filter(l => isSameWeek(new Date(l.date), now))
  const month = lessons.filter(l => isSameMonth(new Date(l.date), now))

  const debt = calcDebtByStudent(lessons)
  const bySubject = incomeBySubject(month)

  return (
    <div className="screen" id="finance-report">
      <h1>Финансы</h1>

      <Section title="Средний чек">
        <div>Сегодня: <b>{calcAverageCheck(day)} ₽</b></div>
        <div>Неделя: <b>{calcAverageCheck(week)} ₽</b></div>
        <div>Месяц: <b>{calcAverageCheck(month)} ₽</b></div>
      </Section>

      <Section title="Задолженность">
        {Object.keys(debt).length === 0 && <div className="muted">Нет долгов</div>}
        {Object.entries(debt).map(([name, sum]) => (
          <div key={name}>{name}: <b>{sum} ₽</b></div>
        ))}
      </Section>

      <Section title="Доход по предметам (месяц)">
        {Object.entries(bySubject).map(([subj, sum]) => (
          <div key={subj}>{subj}: <b>{sum} ₽</b></div>
        ))}
      </Section>

      <Section title="Итоги месяца">
        <div>План: <b>{calcPlan(month)} ₽</b></div>
        <div>Факт: <b>{calcFact(month)} ₽</b></div>
      </Section>

      <button onClick={exportFinancePDF}>📄 Экспорт PDF</button>
    </div>
  )
}