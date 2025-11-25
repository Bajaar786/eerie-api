import { SearchFilters, EntityClassification, EntityStatus } from '../types'
import { Filter, X } from 'lucide-react'
import './SearchSidebar.css'

interface Props {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

const classifications: EntityClassification[] = [
  'Apparition',
  'Cryptid',
  'Demonic',
  'Extraterrestrial',
  'Undead',
  'Other',
]

const statuses: EntityStatus[] = [
  'ACTIVE',
  'DORMANT',
  'CONTAINED',
  'NEUTRALIZED',
  'UNKNOWN',
]

export default function SearchSidebar({ filters, onFiltersChange }: Props) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value || undefined })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasFilters = Object.keys(filters).length > 0

  return (
    <div className="search-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Filter size={20} />
          <h3>Filters</h3>
        </div>
        {hasFilters && (
          <button className="btn-text" onClick={clearFilters}>
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          placeholder="Search entities..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Classification</label>
        <select
          value={filters.classification || ''}
          onChange={(e) => updateFilter('classification', e.target.value)}
        >
          <option value="">All Classifications</option>
          {classifications.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Threat Level</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            min="1"
            max="10"
            value={filters.minThreatLevel || ''}
            onChange={(e) => updateFilter('minThreatLevel', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            min="1"
            max="10"
            value={filters.maxThreatLevel || ''}
            onChange={(e) => updateFilter('maxThreatLevel', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select
          value={filters.status || ''}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Location</label>
        <input
          type="text"
          placeholder="City, country..."
          value={filters.location || ''}
          onChange={(e) => updateFilter('location', e.target.value)}
        />
      </div>
    </div>
  )
}
