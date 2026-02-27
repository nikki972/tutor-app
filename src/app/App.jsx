import { Routes, Route } from 'react-router-dom'
import Lessons from '../screens/Lessons'
import Students from '../screens/Students'
import Archive from '../screens/Archive'
import Stats from '../screens/Stats'
import Settings from '../screens/Settings'
import BottomTabs from '../components/BottomTabs'

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Lessons />} />
        <Route path="/students" element={<Students />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BottomTabs />
    </div>
  )
}