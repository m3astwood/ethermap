import { Model } from 'objection'

class PointModel extends Model {
  static tableName = 'map_points'

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static jsonSchema = {
    type: 'object',
    required: ['location'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string'},
      notes: { type: 'string' },
      location: { type: 'string' }
    }
  }

}

export default PointModel
