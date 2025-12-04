import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { suggestionAPI } from '../services/api'
import { EntityClassification } from '../types'
import { Lightbulb, Loader, Plus, X } from 'lucide-react'
import './SuggestEntity.css'

const classifications: EntityClassification[] = [
  'Apparition',
  'Cryptid',
  'Demonic',
  'Extraterrestrial',
  'Undead',
  'Other',
]

export default function SuggestEntity() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    classification: 'Apparition' as EntityClassification,
    threatLevel: 5,
    description: '',
    abilities: [''],
    weaknesses: [''],
    firstSighted: '',
    lastSighted: '',
    imageUrl: '',
    sourceCitation: '',
  })

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addAbility = () => {
    setFormData(prev => ({ ...prev, abilities: [...prev.abilities, ''] }))
  }

  const updateAbility = (index: number, value: string) => {
    const newAbilities = [...formData.abilities]
    newAbilities[index] = value
    setFormData(prev => ({ ...prev, abilities: newAbilities }))
  }

  const removeAbility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      abilities: prev.abilities.filter((_, i) => i !== index),
    }))
  }

  const addWeakness = () => {
    setFormData(prev => ({ ...prev, weaknesses: [...prev.weaknesses, ''] }))
  }

  const updateWeakness = (index: number, value: string) => {
    const newWeaknesses = [...formData.weaknesses]
    newWeaknesses[index] = value
    setFormData(prev => ({ ...prev, weaknesses: newWeaknesses }))
  }

  const removeWeakness = (index: number) => {
    setFormData(prev => ({
      ...prev,
      weaknesses: prev.weaknesses.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        abilities: formData.abilities.filter(a => a.trim()),
        weaknesses: formData.weaknesses.filter(w => w.trim()),
        firstSighted: formData.firstSighted || null,
        lastSighted: formData.lastSighted || null,
      }

      await suggestionAPI.submit(submitData)
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit suggestion')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="suggest-entity">
        <div className="container">
          <div className="success-message">
            <Lightbulb size={48} />
            <h2>Suggestion Submitted!</h2>
            <p>Your entity suggestion has been submitted for review.</p>
            <p>You'll earn reputation points if it's approved!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="suggest-entity">
      <div className="container">
        <div className="suggest-header">
          <Lightbulb size={40} />
          <h1>Suggest New Entity</h1>
          <p className="subtitle">Help expand the database with your knowledge</p>
        </div>

        <form onSubmit={handleSubmit} className="suggest-form">
          {error && <div className="error">{error}</div>}

          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Entity Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., The Jersey Devil"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Classification *</label>
                <select
                  value={formData.classification}
                  onChange={(e) => updateField('classification', e.target.value)}
                  required
                >
                  {classifications.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Threat Level (1-10) *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.threatLevel}
                  onChange={(e) => updateField('threatLevel', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Detailed description of the entity..."
                rows={6}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Abilities</h3>
            {formData.abilities.map((ability, index) => (
              <div key={index} className="array-input">
                <input
                  type="text"
                  value={ability}
                  onChange={(e) => updateAbility(index, e.target.value)}
                  placeholder="e.g., Flight, Invisibility"
                />
                {formData.abilities.length > 1 && (
                  <button
                    type="button"
                    className="btn-icon btn-danger-icon"
                    onClick={() => removeAbility(index)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addAbility}>
              <Plus size={16} />
              Add Ability
            </button>
          </div>

          <div className="form-section">
            <h3>Weaknesses</h3>
            {formData.weaknesses.map((weakness, index) => (
              <div key={index} className="array-input">
                <input
                  type="text"
                  value={weakness}
                  onChange={(e) => updateWeakness(index, e.target.value)}
                  placeholder="e.g., Silver, Sunlight"
                />
                {formData.weaknesses.length > 1 && (
                  <button
                    type="button"
                    className="btn-icon btn-danger-icon"
                    onClick={() => removeWeakness(index)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addWeakness}>
              <Plus size={16} />
              Add Weakness
            </button>
          </div>

          <div className="form-section">
            <h3>Additional Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label>First Sighted</label>
                <input
                  type="date"
                  value={formData.firstSighted}
                  onChange={(e) => updateField('firstSighted', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Last Sighted</label>
                <input
                  type="date"
                  value={formData.lastSighted}
                  onChange={(e) => updateField('lastSighted', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => updateField('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label>Source Citation *</label>
              <textarea
                value={formData.sourceCitation}
                onChange={(e) => updateField('sourceCitation', e.target.value)}
                placeholder="Where did you learn about this entity? Include books, websites, folklore sources, etc."
                rows={3}
                required
              />
              <small>Please provide credible sources for your information</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="spin" size={20} />
                  Submitting...
                </>
              ) : (
                'Submit Suggestion'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
