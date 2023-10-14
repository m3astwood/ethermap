import { Model } from 'objection'

class PointModel extends Model {
  static tableName = 'map_points'

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
