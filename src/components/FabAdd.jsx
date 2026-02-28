import { useState } from 'react'
import QuickAdd from './QuickAdd'

export default function FabAdd() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="fab"
        onClick={() => setOpen(true)}
        aria-label="Добавить урок"
      >
        ＋
      </button>

      {open && <QuickAdd onClose={() => setOpen(false)} />}
    </>
  )
}