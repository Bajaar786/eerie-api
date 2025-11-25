import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { entityAPI } from '../services/api'
import { Entity } from '../types'
import { Loader } from 'lucide-react'
import EntityModal from '../components/EntityModal'

export default function EntityDetail() {
  const { id } = useParams<{ id: string }>()
  const [entity, setEntity] = useState<Entity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadEntity(id)
    }
  }, [id])

  const loadEntity = async (entityId: string) => {
    try {
      const response = await entityAPI.getById(entityId)
      setEntity(response.data)
    } catch (err) {
      console.error('Failed to load entity', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <Loader className="spin" size={40} />
        <p>Loading entity...</p>
      </div>
    )
  }

  if (!entity) {
    return <div className="error">Entity not found</div>
  }

  return <EntityModal entity={entity} onClose={() => window.history.back()} />
}
