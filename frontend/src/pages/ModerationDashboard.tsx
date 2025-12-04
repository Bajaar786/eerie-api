import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { suggestionAPI } from '../services/api'
import { EntitySuggestion } from '../types'
import { Shield, Check, X, Loader, Eye } from 'lucide-react'
import './ModerationDashboard.css'

export default function ModerationDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState<EntitySuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSuggestion, setSelectedSuggestion] = useState<EntitySuggestion | null>(null)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    if (!user || (user.role !== 'MODERATOR' && user.role !== 'ADMIN')) {
      navigate('/')
      return
    }
    loadSuggestions()
  }, [user, navigate])

  const loadSuggestions = async () => {
    try {
      setLoading(true)
      const response = await suggestionAPI.getAll({ status: 'PENDING' })
      setSuggestions(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setReviewing(true)
      await suggestionAPI.review(id, status, reviewComment || undefined)
      setSuggestions(prev => prev.filter(s => s.id !== id))
      setSelectedSuggestion(null)
      setReviewComment('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to review suggestion')
    } finally {
      setReviewing(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <Loader className="spin" size={40} />
        <p>Loading suggestions...</p>
      </div>
    )
  }

  return (
    <div className="moderation-dashboard">
      <div className="container">
        <div className="moderation-header">
          <Shield size={40} />
          <h1>Moderation Dashboard</h1>
          <p className="subtitle">Review community entity suggestions</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="moderation-stats">
          <div className="stat-card">
            <span className="stat-number">{suggestions.length}</span>
            <span className="stat-label">Pending Review</span>
          </div>
        </div>

        {suggestions.length === 0 ? (
          <div className="empty-state">
            <p>No pending suggestions to review</p>
          </div>
        ) : (
          <div className="suggestions-grid">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-card">
                <div className="suggestion-header">
                  <div>
                    <h3>{suggestion.name}</h3>
                    <span className={`badge badge-${suggestion.classification.toLowerCase()}`}>
                      {suggestion.classification}
                    </span>
                  </div>
                  <div className="threat-badge" style={{
                    borderColor: suggestion.threatLevel >= 8 ? '#FF4444' : suggestion.threatLevel >= 5 ? '#FFB800' : '#00FF88'
                  }}>
                    {suggestion.threatLevel}
                  </div>
                </div>

                <p className="suggestion-description">{suggestion.description}</p>

                <div className="suggestion-meta">
                  <div className="meta-item">
                    <strong>Submitted by:</strong> {suggestion.submittedBy?.username}
                  </div>
                  <div className="meta-item">
                    <strong>Reputation:</strong> {suggestion.submittedBy?.reputationScore}
                  </div>
                </div>

                <div className="suggestion-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedSuggestion(suggestion)}
                  >
                    <Eye size={16} />
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSuggestion && (
          <div className="modal-overlay" onClick={() => setSelectedSuggestion(null)}>
            <div className="modal review-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedSuggestion.name}</h2>
                <button className="btn-icon" onClick={() => setSelectedSuggestion(null)}>
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="review-section">
                  <strong>Classification:</strong>
                  <span className={`badge badge-${selectedSuggestion.classification.toLowerCase()}`}>
                    {selectedSuggestion.classification}
                  </span>
                </div>

                <div className="review-section">
                  <strong>Threat Level:</strong> {selectedSuggestion.threatLevel}/10
                </div>

                <div className="review-section">
                  <strong>Description:</strong>
                  <p>{selectedSuggestion.description}</p>
                </div>

                <div className="review-section">
                  <strong>Abilities:</strong>
                  <ul>
                    {selectedSuggestion.abilities.map((ability, i) => (
                      <li key={i}>{ability}</li>
                    ))}
                  </ul>
                </div>

                <div className="review-section">
                  <strong>Weaknesses:</strong>
                  <ul>
                    {selectedSuggestion.weaknesses.map((weakness, i) => (
                      <li key={i}>{weakness}</li>
                    ))}
                  </ul>
                </div>

                <div className="review-section">
                  <strong>Source Citation:</strong>
                  <p>{selectedSuggestion.sourceCitation}</p>
                </div>

                <div className="review-section">
                  <strong>Submitted by:</strong> {selectedSuggestion.submittedBy?.username}
                  <br />
                  <strong>Reputation:</strong> {selectedSuggestion.submittedBy?.reputationScore}
                </div>

                <div className="review-section">
                  <label>Review Comment (optional)</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add feedback for the contributor..."
                    rows={3}
                  />
                </div>

                <div className="review-actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReview(selectedSuggestion.id, 'REJECTED')}
                    disabled={reviewing}
                  >
                    <X size={16} />
                    Reject
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleReview(selectedSuggestion.id, 'APPROVED')}
                    disabled={reviewing}
                  >
                    <Check size={16} />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
