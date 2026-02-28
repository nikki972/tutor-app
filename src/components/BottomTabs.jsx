import { NavLink } from 'react-router-dom'

export default function BottomTabs() {
  return (
    <nav className="tabs">
      <NavLink to="/">🏠</NavLink>
      <NavLink to="/lessons">📅</NavLink>
      <NavLink to="/students">👤</NavLink>
      <NavLink to="/stats">📊</NavLink>
      <NavLink to="/settings">⚙️</NavLink>
    </nav>
  )
}