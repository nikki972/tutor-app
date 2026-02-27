export function calcIncome(lessons) {
  return lessons
    .filter(l => l.status === 'done' && l.payment === 'paid')
    .reduce((sum, l) => sum + (l.price || 0), 0)
}