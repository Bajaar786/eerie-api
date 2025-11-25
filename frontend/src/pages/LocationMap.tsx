import { useState, useEffect } from 'react'
import { locationAPI } from '../services/api'
import { Location } from '../types'
import { MapPin, Loader, AlertTriangle } from 'lucide-react'
import './LocationMap.css'

export default function LocationMap() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      const response = await locationAPI.getAll()
      setLocations(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load locations')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <Loader className="spin" size={40} />
        <p>Loading locations...</p>
      </div>
    )
  }

  return (
    <div className="location-map">
      <div className="container">
        <div className="map-header">
          <div>
            <h1>Location Hotspots</h1>
            <p className="subtitle">Supernatural activity locations worldwide</p>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="map-notice">
          <AlertTriangle size={20} />
          <div>
            <strong>Mapbox Integration Ready</strong>
            <p>Add your Mapbox access token to enable interactive map visualization</p>
          </div>
        </div>

        <div className="locations-grid">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`location-card ${selectedLocation?.id === location.id ? 'selected' : ''}`}
              onClick={() => setSelectedLocation(location)}
            >
              <div className="location-icon">
                <MapPin size={24} />
              </div>
              <div className="location-info">
                <h3>{location.name}</h3>
                <p className="location-address">
                  {location.address && `${location.address}, `}
                  {location.city}
                  {location.state && `, ${location.state}`}
                </p>
                <p className="location-country">{location.country}</p>
                {location.description && (
                  <p className="location-description">{location.description}</p>
                )}
                <div className="location-coords">
                  <span>📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedLocation && (
          <div className="location-detail">
            <h2>{selectedLocation.name}</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <strong>City:</strong> {selectedLocation.city}
              </div>
              {selectedLocation.state && (
                <div className="detail-item">
                  <strong>State:</strong> {selectedLocation.state}
                </div>
              )}
              <div className="detail-item">
                <strong>Country:</strong> {selectedLocation.country}
              </div>
              <div className="detail-item">
                <strong>Coordinates:</strong> {selectedLocation.latitude}, {selectedLocation.longitude}
              </div>
            </div>
            {selectedLocation.description && (
              <div className="detail-description">
                <strong>Description:</strong>
                <p>{selectedLocation.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
