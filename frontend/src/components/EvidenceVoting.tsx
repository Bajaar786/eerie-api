import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { voteAPI } from '../services/api'
import { ThumbsUp, ThumbsDown, TrendingUp, Users } from 'lucide-react'
import './EvidenceVoting.css'

interface Props {
  incidentId: string
}

export default function EvidenceVoting({ incidentId }: Props) {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [userVote, setUserVote] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  useEffect(() => {
    loadVoteData()
  }, [incidentId])

  const loadVoteData = async () => {
    try {
      setLoading(true)
      const [statsRes, voteRes] = await Promise.all([
        voteAPI.getStats(incidentId),
        isAuthenticated ? voteAPI.getUserVote(incidentId) : Promise.resolve({ data: { voted: false } }),
      ])
      setStats(statsRes.data)
      setUserVote(voteRes.data.voted ? voteRes.data.voteType : null)
    } catch (err) {
      console.error('Failed to load vote data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (voteType: 'CREDIBLE' | 'NOT_CREDIBLE') => {
    if (!isAuthenticated) {
      alert('Please login to vote')
      return
    }

    try {
      setVoting(true)
      await voteAPI.voteOnIncident(incidentId, voteType)
      setUserVote(voteType)
      await loadVoteData()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to vote')
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return <div className="evidence-voting loading">Loading votes...</div>
  }

  const credibilityColor = () => {
    if (stats.credibilityScore >= 10) return '#00FF88'
    if (stats.credibilityScore >= 5) return '#FFB800'
    if (stats.credibilityScore >= 0) return '#A0A0C0'
    return '#FF4444'
  }

  const credibilityLabel = () => {
    if (stats.credibilityScore >= 10) return 'Highly Credible'
    if (stats.credibilityScore >= 5) return 'Credible'
    if (stats.credibilityScore >= 0) return 'Unverified'
    return 'Disputed'
  }

  return (
    <div className="evidence-voting">
      <div className="voting-header">
        <TrendingUp size={20} />
        <h3>Community Credibility</h3>
      </div>

      <div className="credibility-score" style={{ borderColor: credibilityColor() }}>
        <div className="score-value" style={{ color: credibilityColor() }}>
          {stats.credibilityScore > 0 ? '+' : ''}{stats.credibilityScore}
        </div>
        <div className="score-label">{credibilityLabel()}</div>
        <div className="score-percentage">
          {stats.credibilityPercentage}% credible
        </div>
      </div>

      <div className="vote-stats">
        <div className="stat-item">
          <ThumbsUp size={16} style={{ color: '#00FF88' }} />
          <span>{stats.credibleVotes} credible</span>
        </div>
        <div className="stat-item">
          <ThumbsDown size={16} style={{ color: '#FF4444' }} />
          <span>{stats.notCredibleVotes} not credible</span>
        </div>
        <div className="stat-item">
          <Users size={16} />
          <span>{stats.totalVotes} total votes</span>
        </div>
      </div>

      {isAuthenticated && (
        <div className="vote-buttons">
          <button
            className={`vote-btn credible ${userVote === 'CREDIBLE' ? 'active' : ''}`}
            onClick={() => handleVote('CREDIBLE')}
            disabled={voting}
          >
            <ThumbsUp size={20} />
            <span>Credible</span>
          </button>
          <button
            className={`vote-btn not-credible ${userVote === 'NOT_CREDIBLE' ? 'active' : ''}`}
            onClick={() => handleVote('NOT_CREDIBLE')}
            disabled={voting}
          >
            <ThumbsDown size={20} />
            <span>Not Credible</span>
          </button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="vote-login-prompt">
          <p>Login to vote on this incident's credibility</p>
        </div>
      )}

      {userVote && (
        <div className="user-vote-indicator">
          You voted: <strong>{userVote === 'CREDIBLE' ? '👍 Credible' : '👎 Not Credible'}</strong>
        </div>
      )}
    </div>
  )
}
