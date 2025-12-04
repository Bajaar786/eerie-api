import { ContributionLog } from '../types'
import { Lightbulb, Check, FileText, ThumbsUp, Award } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import './ContributionHistory.css'

interface Props {
  logs: ContributionLog[]
}

export default function ContributionHistory({ logs }: Props) {
  const getIcon = (actionType: string) => {
    switch (actionType) {
      case 'ENTITY_SUGGESTED':
        return <Lightbulb size={16} />
      case 'ENTITY_APPROVED':
        return <Check size={16} />
      case 'INCIDENT_REPORTED':
        return <FileText size={16} />
      case 'VOTE_CAST':
        return <ThumbsUp size={16} />
      default:
        return <Award size={16} />
    }
  }

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'ENTITY_SUGGESTED':
        return 'Entity Suggested'
      case 'ENTITY_APPROVED':
        return 'Entity Approved'
      case 'INCIDENT_REPORTED':
        return 'Incident Reported'
      case 'VOTE_CAST':
        return 'Vote Cast'
      default:
        return actionType
    }
  }

  if (logs.length === 0) {
    return (
      <div className="empty-history">
        <p>No contribution history yet</p>
      </div>
    )
  }

  return (
    <div className="contribution-history">
      <div className="contribution-timeline">
        {logs.map((log) => (
          <div key={log.id} className="contribution-item">
            <div className="contribution-header">
              <div className="contribution-type">
                {getIcon(log.actionType)}
                <span>{getActionLabel(log.actionType)}</span>
              </div>
              <div className="contribution-points">
                <Award size={14} />
                <span>+{log.pointsEarned}</span>
              </div>
            </div>
            <div className="contribution-description">
              {log.description}
            </div>
            <div className="contribution-date">
              {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
