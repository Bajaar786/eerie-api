import { useState, useEffect } from 'react'
import { entityAPI } from '../services/api'
import { Entity, SearchFilters } from '../types'
import EntityCard from '../components/EntityCard'
import SearchSidebar from '../components/SearchSidebar'
import EntityModal from '../components/EntityModal'
import { Grid, List, Loader } from 'lucide-react'
import './EntityBrowser.css'

export default function EntityBrowser() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({})

  useEffect(() => {
    loadEntities()
  }, [filters])

  const loadEntities = async () => {
    try {
      setLoading(true)
      setError('')
      const response = Object.keys(filters).length > 0
        ? await entityAPI.search(filters)
        : await entityAPI.getAll()
      setEntities(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load entities')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="entity-browser">
      <div className="container">
        <div className="browser-header">
          <div>
            <h1>Entity Database</h1>
            <p className="subtitle">Browse and search supernatural entities</p>
          </div>
          <div className="view-controls">
            <button
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="browser-content">
          <SearchSidebar filters={filters} onFiltersChange={setFilters} />

          <div className="browser-main">
            {error && <div className="error">{error}</div>}

            {loading ? (
              <div className="loading">
                <Loader className="spin" size={40} />
                <p>Loading entities...</p>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <p>{entities.length} entities found</p>
                </div>

                <div className={`entity-${viewMode}`}>
                  {entities.map((entity) => (
                    <EntityCard
                      key={entity.id}
                      entity={entity}
                      viewMode={viewMode}
                      onClick={() => setSelectedEntity(entity)}
                    />
                  ))}
                </div>

                {entities.length === 0 && (
                  <div className="empty-state">
                    <p>No entities found matching your criteria</p>
                    <button className="btn btn-secondary" onClick={() => setFilters({})}>
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedEntity && (
        <EntityModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </div>
  )
}
