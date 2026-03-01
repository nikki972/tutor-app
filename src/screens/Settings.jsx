import { useRef } from 'react'
import { exportWeekPDF } from '../utils/pdf'
import { exportBackup, importBackup } from '../utils/backup'

export default function Settings() {
  const fileRef = useRef(null)

  async function onImport(e) {
    const file = e.target.files[0]
    if (!file) return
    await importBackup(file)
    alert('Backup imported')
  }

  return (
    <div className="p-4 space-y-4">
      <button className="ios-btn" onClick={exportWeekPDF}>
        Export PDF
      </button>

      <button className="ios-btn" onClick={exportBackup}>
        Export Backup
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        hidden
        onChange={onImport}
      />

      <button className="ios-btn" onClick={() => fileRef.current.click()}>
        Import Backup
      </button>
    </div>
  )
}