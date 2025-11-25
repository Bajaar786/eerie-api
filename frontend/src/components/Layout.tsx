import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Ghost, Home, Search, MapPin, FileText, LogOut } from 'lucide-react'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="logo">
            <Ghost size={32} />
            <span>Eerie API</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/entities" className={isActive('/entities') ? 'active' : ''}>
              <Search size={20} />
              <span>Entities</span>
            </Link>
            <Link to="/map" className={isActive('/map') ? 'active' : ''}>
              <MapPin size={20} />
              <span>Map</span>
            </Link>
            <Link to="/report" className={isActive('/report') ? 'active' : ''}>
              <FileText size={20} />
              <span>Report</span>
            </Link>
          </div>

          <div className="nav-user">
            {user ? (
              <>
                <span className="user-info">
                  {user.username}
                  <span className="user-role">{user.role}</span>
                </span>
                <button onClick={logout} className="btn-icon">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2024 Eerie API - Supernatural Entity Database</p>
          <p className="footer-tagline">Documenting the unexplained since 2024 👻</p>
        </div>
      </footer>
    </div>
  )
}
