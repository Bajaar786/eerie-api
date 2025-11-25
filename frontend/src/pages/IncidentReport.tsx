import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { entityAPI, locationAPI, incidentAPI } from '../services/api'
import { Entity, Location } from '../types'
import { FileText, AlertCircle, MapPin, Calendar, Users, Loader } from 'lucide-react'
import './IncidentReport.css'

export default function IncidentReport() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [entities, setEntities] = useState<Entity[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    severity: 5,
    witnesses: 1,
    entityId: '',
    locationId: '',
    evidence: [] as string[],
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadData()
  }, [isAuthenticated, navigate])

  const loadData = async () => {
    try {
      const [entitiesRes, locationsRes] = await Promise.all([
        entityAPI.getAll(),
        locationAPI.getAll(),
      ])
      setEntities(entitiesRes.data)
      setLocations(locationsRes.data)
    } catch (err) {
      setError('Failed to load data')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await incidentAPI.create(formData)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit incident')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description)) {
      setError('Please fill in all required fields')
      return
    }
    if (step === 2 && !formData.entityId) {
      setError('Please select an entity')
      return
    }
    if (step === 3 && !formData.locationId) {
      setError('Please select a location')
      return
    }
    setError('')
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  return (
    <div className="incident-report">
      <div className="container">
        <div className="report-header">
          <FileText size={40} />
          <h1>Report Incident</h1>
          <p className="subtitle">Document a supernatural encounter</p>
        </div>

        <div className="report-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Details</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Entity</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Location</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <span>Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {error && <div className="error">{error}</div>}

          {step === 1 && (
            <div className="form-step fade-in">
              <h2>Incident Details</h2>
              
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Brief description of the incident"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Detailed account of what happened..."
                  rows={6}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Calendar size={16} />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <AlertCircle size={16} />
                    Severity (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.severity}
                    onChange={(e) => updateField('severity', parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Users size={16} />
                    Witnesses
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.witnesses}
                    onChange={(e) => updateField('witnesses', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step fade-in">
              <h2>Select Entity</h2>
              <p className="step-description">Which entity was involved in this incident?</p>

              <div className="entity-select-grid">
                {entities.map((entity) => (
                  <div
                    key={entity.id}
                    className={`entity-select-card ${formData.entityId === entity.id ? 'selected' : ''}`}
                    onClick={() => updateField('entityId', entity.id)}
                  >
                    <h4>{entity.name}</h4>
                    <span className={`badge badge-${entity.classification.toLowerCase()}`}>
                      {entity.classification}
                    </span>
                    <div className="entity-threat">
                      Threat: {entity.threatLevel}/10
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                  Back
                </button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step fade-in">
              <h2>Select Location</h2>
              <p className="step-description">Where did this incident occur?</p>

              <div className="location-select-grid">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`location-select-card ${formData.locationId === location.id ? 'selected' : ''}`}
                    onClick={() => updateField('locationId', location.id)}
                  >
                    <MapPin size={20} />
                    <div>
                      <h4>{location.name}</h4>
                      <p>{location.city}, {location.country}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                  Back
                </button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step fade-in">
              <h2>Review & Submit</h2>
              <p className="step-description">Please review your incident report</p>

              <div className="review-section">
                <h3>Incident Details</h3>
                <div className="review-item">
                  <strong>Title:</strong> {formData.title}
                </div>
                <div className="review-item">
                  <strong>Description:</strong> {formData.description}
                </div>
                <div className="review-item">
                  <strong>Date:</strong> {formData.date}
                </div>
                <div className="review-item">
                  <strong>Severity:</strong> {formData.severity}/10
                </div>
                <div className="review-item">
                  <strong>Witnesses:</strong> {formData.witnesses}
                </div>
              </div>

              <div className="review-section">
                <h3>Entity</h3>
                <div className="review-item">
                  {entities.find(e => e.id === formData.entityId)?.name}
                </div>
              </div>

              <div className="review-section">
                <h3>Location</h3>
                <div className="review-item">
                  {locations.find(l => l.id === formData.locationId)?.name}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
