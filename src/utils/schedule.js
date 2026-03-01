export function findFreeTime(lessons) {
  const used = lessons.map(l => l.time)
  for (let h = 8; h <= 20; h++) {
    const t = `${String(h).padStart(2, '0')}:00`
    if (!used.includes(t)) return t
  }
  return '08:00'
}

export function hasConflict(time, lessons) {
  return lessons.some(l => l.time === time)
}