export function calcFact(lessons) {
  return lessons
    .filter(l => l.status === 'done' && l.payment === 'paid')
    .reduce((sum, l) => sum + l.price, 0)
}

export function calcPlan(lessons) {
  return lessons
    .filter(l => l.status === 'planned')
    .reduce((sum, l) => sum + l.price, 0)
}