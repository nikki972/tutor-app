import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import QuickAdd from './QuickAdd'

export default function FabAdd() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname !== '/' && pathname !== '/lessons') return null

  return (
    <>
      <button className="fab" onClick={() => setOpen(true)}>＋</button>
      {open && <QuickAdd onClose={() => setOpen(false)} />}
    </>
  )
}