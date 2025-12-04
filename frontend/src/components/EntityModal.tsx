import { useState } from 'react'
import { Entity } from '../types'
import { X, AlertTriangle, Shield, Zap, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import './EntityModal.css'

interface Props {
  entity: Entity
  onClose: () => void
}

export default function EntityModal({ entity, onClose }: Props) {
  const [expandedSections, setExpandedSections] = useState({
    abilities: true,
    weaknesses: true,
    incidents: false,
    locations: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const threatColor = (level: number) => {
    if (level >= 8) return '#FF4444'
    if (level >= 5) return '#FFB800'
    return '#00FF88'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal entity-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{entity.name}</h2>
            <div className="modal-badges">
              <span className={`badge badge-${entity.classification.toLowerCase()}`}>
                {entity.classification}
              </span>
              <span className="badge" style={{ background: 'var(--surface-hover)' }}>
                {entity.status}
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="threat-indicator" style={{ borderColor: threatColor(entity.threatLevel) }}>
            <AlertTriangle size={24} style={{ color: threatColor(entity.threatLevel) }} />
            <div>
              <span className="threat-label">Threat Level</span>
              <span className="threat-value">{entity.threatLevel}/10</span>
            </div>
          </div>

          <div className="entity-description-full">
            <p>{entity.description}</p>
          </div>

          <div className="entity-dates">
            {entity.firstSighted && (
              <div className="date-item">
                <Calendar size={16} />
                <span>First Sighted: {format(new Date(entity.firstSighted), 'MMMM d, yyyy')}</span>
              </div>
            )}
            {entity.lastSighted && (
              <div className="date-item">
                <Calendar size={16} />
                <span>Last Sighted: {format(new Date(entity.lastSighted), 'MMMM d, yyyy')}</span>
              </div>
            )}
          </div>

          <div className="expandable-section">
            <button
              className="section-header"
              onClick={() => toggleSection('abilities')}
            >
              <div className="section-title">
                <Zap size={20} />
                <h3>Abilities ({entity.abilities.length})</h3>
              </div>
              {expandedSections.abilities ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.abilities && (
              <div className="section-content">
                <ul className="ability-list">
                  {entity.abilities.map((ability, i) => (
                    <li key={i}>{ability}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="expandable-section">
            <button
              className="section-header"
              onClick={() => toggleSection('weaknesses')}
            >
              <div className="section-title">
                <Shield size={20} />
                <h3>Weaknesses ({entity.weaknesses.length})</h3>
              </div>
              {expandedSections.weaknesses ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.weaknesses && (
              <div className="section-content">
                <ul className="weakness-list">
                  {entity.weaknesses.map((weakness, i) => (
                    <li key={i}>{weakness}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
