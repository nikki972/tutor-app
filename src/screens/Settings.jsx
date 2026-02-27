import { useEffect, useState } from 'react'
import { exportWeekPDF } from '../utils/pdf'

export default function Settings() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="screen">
      <h1>Настройки</h1>

      <button
        onClick={() =>
          setTheme(t => (t === 'light' ? 'dark' : 'light'))
        }
      >
        Тема: {theme === 'light' ? 'Светлая' : 'Тёмная'}
      </button>

      <div style={{ marginTop: 24 }}>
        <button onClick={exportWeekPDF}>
          Экспорт PDF недели
        </button>
      </div>
    </div>
  )
}