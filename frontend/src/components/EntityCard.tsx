import { Entity } from '../types'
import { AlertTriangle, MapPin, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import './EntityCard.css'

interface Props {
  entity: Entity
  viewMode: 'grid' | 'list'
  onClick: () => void
}

export default function EntityCard({ entity, viewMode, onClick }: Props) {
  const threatColor = (level: number) => {
    if (level >= 8) return '#FF4444'
    if (level >= 5) return '#FFB800'
    return '#00FF88'
  }

  return (
    <div className={`entity-card ${viewMode}`} onClick={onClick}>
      <div className="entity-header">
        <div>
          <h3>{entity.name}</h3>
          <span className={`badge badge-${entity.classification.toLowerCase()}`}>
            {entity.classification}
          </span>
        </div>
        <div className="threat-badge" style={{ borderColor: threatColor(entity.threatLevel) }}>
          <AlertTriangle size={16} style={{ color: threatColor(entity.threatLevel) }} />
          <span>{entity.threatLevel}</span>
        </div>
      </div>

      <p className="entity-description">{entity.description}</p>

      <div className="entity-meta">
        {entity.lastSighted && (
          <div className="meta-item">
            <Calendar size={14} />
            <span>Last seen: {format(new Date(entity.lastSighted), 'MMM d, yyyy')}</span>
          </div>
        )}
        <div className="meta-item">
          <MapPin size={14} />
          <span>{entity.status}</span>
        </div>
      </div>

      <div className="entity-stats">
        <div className="stat">
          <span className="stat-label">Abilities</span>
          <span className="stat-value">{entity.abilities.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Weaknesses</span>
          <span className="stat-value">{entity.weaknesses.length}</span>
        </div>
      </div>
    </div>
  )
}
