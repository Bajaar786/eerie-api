import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { userAPI } from '../services/api'
import { UserProfile as UserProfileType } from '../types'
import { User, Award, TrendingUp, FileText, ThumbsUp, Lightbulb, Loader } from 'lucide-react'
import ContributionHistory from '../components/ContributionHistory'
import './UserProfile.css'

export default function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<UserProfileType | null>(null)
  const [contributions, setContributions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadProfile(id)
    }
  }, [id])

  const loadProfile = async (userId: string) => {
    try {
      setLoading(true)
      const [profileRes, contributionsRes] = await Promise.all([
        userAPI.getProfile(userId),
        userAPI.getContributions(userId),
      ])
      setProfile(profileRes.data)
      setContributions(contributionsRes.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <Loader className="spin" size={40} />
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container">
        <div className="error">{error || 'Profile not found'}</div>
      </div>
    )
  }

  const getReputationLevel = (score: number) => {
    if (score >= 1000) return { level: '⭐ Legend', color: '#FFD700' }
    if (score >= 500) return { level: '🎓 Scholar', color: '#C084FC' }
    if (score >= 200) return { level: '👻 Expert', color: '#60A5FA' }
    if (score >= 50) return { level: '🔍 Investigator', color: '#4ADE80' }
    return { level: '🌱 Novice', color: '#A0A0C0' }
  }

  const repLevel = getReputationLevel(profile.reputationScore)

  return (
    <div className="user-profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={64} />
          </div>
          <div className="profile-info">
            <h1>{profile.username}</h1>
            <div className="profile-meta">
              <span className="role-badge" style={{ background: 'var(--primary)' }}>
                {profile.role}
              </span>
              <span className="reputation-level" style={{ color: repLevel.color }}>
                {repLevel.level}
              </span>
            </div>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            <div className="profile-joined">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="reputation-card">
          <div className="reputation-header">
            <Award size={24} />
            <h2>Reputation Score</h2>
          </div>
          <div className="reputation-score-large">
            {profile.reputationScore}
          </div>
          <div className="reputation-progress">
            <div 
              className="reputation-bar" 
              style={{ 
                width: `${Math.min((profile.reputationScore % 500) / 5, 100)}%`,
                background: repLevel.color 
              }}
            />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(0, 255, 136, 0.1)' }}>
              <Lightbulb size={24} style={{ color: 'var(--accent)' }} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{profile._count.entitySuggestions}</span>
              <span className="stat-label">Suggestions</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)' }}>
              <FileText size={24} style={{ color: '#C084FC' }} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{profile._count.incidents}</span>
              <span className="stat-label">Incidents</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <ThumbsUp size={24} style={{ color: '#60A5FA' }} />
            </div>
            <div className="stat-content">
              <span className="stat-number">{profile._count.incidentVotes}</span>
              <span className="stat-label">Votes Cast</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
              <TrendingUp size={24} style={{ color: '#FCD34D' }} />
            </div>
            <div className="stat-content">
              <span className="stat-number">
                {contributions?.suggestions.filter((s: any) => s.status === 'APPROVED').length || 0}
              </span>
              <span className="stat-label">Approved</span>
            </div>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h2>Recent Suggestions</h2>
            {contributions?.suggestions.length > 0 ? (
              <div className="suggestions-list">
                {contributions.suggestions.map((suggestion: any) => (
                  <div key={suggestion.id} className="suggestion-item">
                    <div className="suggestion-header">
                      <h4>{suggestion.name}</h4>
                      <span className={`status-badge status-${suggestion.status.toLowerCase()}`}>
                        {suggestion.status}
                      </span>
                    </div>
                    <p className="suggestion-description">{suggestion.description}</p>
                    <div className="suggestion-meta">
                      <span className={`badge badge-${suggestion.classification.toLowerCase()}`}>
                        {suggestion.classification}
                      </span>
                      <span>Threat: {suggestion.threatLevel}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No suggestions yet</p>
            )}
          </div>

          <div className="profile-section">
            <h2>Recent Incidents</h2>
            {contributions?.incidents.length > 0 ? (
              <div className="incidents-list">
                {contributions.incidents.map((incident: any) => (
                  <div key={incident.id} className="incident-item">
                    <h4>{incident.title}</h4>
                    <p>{incident.description}</p>
                    <div className="incident-meta">
                      <span>Entity: {incident.entity.name}</span>
                      <span>•</span>
                      <span>Severity: {incident.severity}/10</span>
                      <span>•</span>
                      <span className={`status-badge status-${incident.status.toLowerCase()}`}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No incidents reported yet</p>
            )}
          </div>

          <div className="profile-section">
            <h2>Contribution History</h2>
            <ContributionHistory logs={contributions?.logs || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
