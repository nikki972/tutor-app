export function isSameDay(d, base) {
  return d.toDateString() === base.toDateString()
}

export function isSameWeek(d, base) {
  const start = new Date(base)
  start.setDate(base.getDate() - ((base.getDay() + 6) % 7))
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 7)

  return d >= start && d < end
}

export function isSameMonth(d, base) {
  return (
    d.getMonth() === base.getMonth() &&
    d.getFullYear() === base.getFullYear()
  )
}

export function calcFact(lessons) {
  return lessons
    .filter(l => l.status === 'done' && l.payment === 'paid')
    .reduce((sum, l) => sum + (l.price || 0), 0)
}

export function calcPlan(lessons) {
  return lessons
    .filter(l => l.status === 'planned')
    .reduce((sum, l) => sum + (l.price || 0), 0)
}