import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { entityAPI, incidentAPI } from '../services/api'
import { EntityStats, Incident } from '../types'
import { TrendingUp, AlertTriangle, MapPin, FileText, Loader } from 'lucide-react'
import { format } from 'date-fns'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState<EntityStats | null>(null)
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsRes, incidentsRes] = await Promise.all([
        entityAPI.getStats(),
        incidentAPI.getAll(),
      ])
      setStats(statsRes.data)
      setRecentIncidents(incidentsRes.data.slice(0, 5))
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <Loader className="spin" size={40} />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="subtitle">Supernatural activity overview</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(0, 255, 136, 0.1)' }}>
              <TrendingUp size={24} style={{ color: 'var(--accent)' }} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Entities</span>
              <span className="stat-number">{stats?.total || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255, 184, 0, 0.1)' }}>
              <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Avg Threat Level</span>
              <span className="stat-number">{stats?.averageThreatLevel.toFixed(1) || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)' }}>
              <MapPin size={24} style={{ color: '#C084FC' }} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Active Entities</span>
              <span className="stat-number">
                {stats?.byStatus.find(s => s.status === 'ACTIVE')?._count || 0}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255, 68, 68, 0.1)' }}>
              <FileText size={24} style={{ color: 'var(--danger)' }} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Recent Incidents</span>
              <span className="stat-number">{recentIncidents.length}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>Classification Breakdown</h2>
            <div className="classification-grid">
              {stats?.byClassification.map((item) => (
                <div key={item.classification} className="classification-card">
                  <span className={`badge badge-${item.classification.toLowerCase()}`}>
                    {item.classification}
                  </span>
                  <span className="classification-count">{item._count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Most Dangerous Entities</h2>
              <Link to="/entities" className="btn btn-secondary">View All</Link>
            </div>
            <div className="dangerous-list">
              {stats?.mostDangerous.map((entity) => (
                <div key={entity.id} className="dangerous-item">
                  <div>
                    <h4>{entity.name}</h4>
                    <span className={`badge badge-${entity.classification.toLowerCase()}`}>
                      {entity.classification}
                    </span>
                  </div>
                  <div className="threat-badge-small" style={{ 
                    borderColor: entity.threatLevel >= 8 ? '#FF4444' : '#FFB800' 
                  }}>
                    <AlertTriangle size={14} />
                    <span>{entity.threatLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Incidents</h2>
              <Link to="/report" className="btn btn-primary">Report Incident</Link>
            </div>
            <div className="incidents-list">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="incident-item">
                  <div className="incident-header">
                    <h4>{incident.title}</h4>
                    <span className={`status-badge status-${incident.status.toLowerCase()}`}>
                      {incident.status}
                    </span>
                  </div>
                  <p className="incident-description">{incident.description}</p>
                  <div className="incident-meta">
                    <span>{format(new Date(incident.date), 'MMM d, yyyy')}</span>
                    <span>•</span>
                    <span>Severity: {incident.severity}/10</span>
                    <span>•</span>
                    <span>{incident.witnesses} witnesses</span>
                    {incident.credibilityScore !== undefined && (
                      <>
                        <span>•</span>
                        <span style={{ 
                          color: incident.credibilityScore >= 5 ? '#00FF88' : incident.credibilityScore >= 0 ? '#FFB800' : '#FF4444' 
                        }}>
                          Credibility: {incident.credibilityScore > 0 ? '+' : ''}{incident.credibilityScore}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
