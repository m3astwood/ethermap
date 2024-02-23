import { Model } from 'objection'

class PointModel extends Model {
  static tableName = 'map_points'

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
      created_by: { type: 'string' },
      updated_by: { type: 'string' }
    },
  }
}

export default PointModel
