import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import EntityBrowser from './pages/EntityBrowser'
import EntityDetail from './pages/EntityDetail'
import IncidentReport from './pages/IncidentReport'
import LocationMap from './pages/LocationMap'
import Login from './pages/Login'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="entities" element={<EntityBrowser />} />
            <Route path="entities/:id" element={<EntityDetail />} />
            <Route path="report" element={<IncidentReport />} />
            <Route path="map" element={<LocationMap />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
