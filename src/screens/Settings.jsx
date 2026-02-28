import { exportWeekPDF } from '../utils/pdf'
import { exportBackup, importBackup } from '../utils/backup'

export default function Settings() {
  function handleImport(e) {
    const file = e.target.files[0]
    if (file) importBackup(file)
  }

  return (
    <div className="screen">
      <h1>Настройки</h1>

      <div className="card">
        <button onClick={exportWeekPDF}>
          📄 Экспорт PDF недели
        </button>
      </div>

      <div className="card">
        <button onClick={exportBackup}>
          💾 Сделать бэкап данных
        </button>

        <label style={{ display: 'block', marginTop: 8 }}>
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
          />
          Восстановить из файла
        </label>
      </div>
    </div>
  )
}