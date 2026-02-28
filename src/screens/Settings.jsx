import { useEffect, useRef, useState } from 'react'
import { exportWeekPDF } from '../utils/pdf'
import { exportBackup, importBackup } from '../utils/backup'

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const fileRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function handleFile(e) {
    const f = e.target.files[0]
    if (f) importBackup(f)
  }

  return (
    <div className="screen">
      <h1>Настройки</h1>

      <div className="card">
        <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
          Тема: {theme === 'light' ? 'Светлая' : 'Тёмная'}
        </button>
      </div>

      <div className="card">
        <button onClick={exportWeekPDF}>📄 PDF недели</button>
      </div>

      <div className="card">
        <button onClick={exportBackup}>💾 Сделать бэкап</button>
        <button onClick={() => fileRef.current.click()} style={{ marginTop: 8 }}>
          ♻ Восстановить из файла
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}