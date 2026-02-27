import { NavLink } from 'react-router-dom'

export default function BottomTabs() {
  return (
    <nav className="tabs">
      <NavLink to="/">Уроки</NavLink>
      <NavLink to="/students">Ученики</NavLink>
      <NavLink to="/archive">Архив</NavLink>
      <NavLink to="/stats">Статистика</NavLink>
      <NavLink to="/settings">Настройки</NavLink>
    </nav>
  )
}