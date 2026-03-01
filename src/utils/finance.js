export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key]
    acc[k] = acc[k] || []
    acc[k].push(item)
    return acc
  }, {})
}

export function calcAverageCheck(lessons) {
  const paid = lessons.filter(l => l.payment === 'paid')
  if (!paid.length) return 0
  return Math.round(
    paid.reduce((s, l) => s + l.price, 0) / paid.length
  )
}

export function calcDebtByStudent(lessons) {
  const map = {}
  lessons.forEach(l => {
    if (l.status === 'done' && l.payment === 'unpaid') {
      map[l.studentName] = (map[l.studentName] || 0) + l.price
    }
  })
  return map
}

export function incomeBySubject(lessons) {
  const map = {}
  lessons.forEach(l => {
    if (l.payment === 'paid') {
      map[l.subject] = (map[l.subject] || 0) + l.price
    }
  })
  return map
}