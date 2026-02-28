import { useEffect, useState } from 'react'
import { exportWeekPDF } from '../utils/pdf'
import { exportBackup, importBackup } from '../utils/backup'

export default function Settings() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function handleImport(e) {
    const file = e.target.files[0]
    if (file) importBackup(file)
  }

  return (
    <div className="screen">
      <h1>Настройки</h1>

      <div className="card">
        <button
          onClick={() =>
            setTheme(t => (t === 'light' ? 'dark' : 'light'))
          }
        >
          Тема: {theme === 'light' ? 'Светлая' : 'Тёмная'}
        </button>
      </div>

      <div className="card">
        <button onClick={exportWeekPDF}>📄 PDF недели</button>
      </div>

      <div className="card">
        <button onClick={exportBackup}>💾 Бэкап данных</button>
        <input
          type="file"
          accept="application/json"
          onChange={handleImport}
          style={{ marginTop: 8 }}
        />
      </div>
    </div>
  )
}