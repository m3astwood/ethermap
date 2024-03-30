import { Model } from 'objection'
import SessionModel from './session'

class PointModel extends Model {
  static tableName = 'map_points'

  id: number
  name: string
  notes: string
  location: { lat: number, lng: number }
  map_id: number
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string

  $beforeInsert() {
    this.created_at = new Date().toISOString()
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString()
  }

  static jsonSchema = {
    type: 'object',
    required: ['location'],
    properties: {
      id: { type: 'integer' },
      name: { type: ['string', 'null'] },
      notes: { type: ['string', 'null'] },
      location: {
        type: 'object',
        properties: {
          lat: { type: 'number' },
          lng: { type: 'number' }
        }
      },
      map_id: { type: 'integer' },
      created_by: { type: 'string' },
      updated_by: { type: 'string' }
    },
  }

  static get relationMappings() {
    return {
      created_by_user: {
        relation: Model.HasOneRelation,
        modelClass: SessionModel,
        join: {
          from: 'map_points.created_by',
          to: 'sessions.sid',
        },
      },
      updated_by_user: {
        relation: Model.HasOneRelation,
        modelClass: SessionModel,
        join: {
          from: 'map_points.updated_by',
          to: 'sessions.sid',
        },
      }
    }
  }
}

export default PointModel
