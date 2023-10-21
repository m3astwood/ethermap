import { Model } from 'objection'
import Point from './point.js'

class MapModel extends Model {
  static tableName = 'maps'

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static jsonSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1 },
      map_points: { type: 'array', items: { type: 'object' } }
    }
  }

  static get relationMappings() {
    return {
      map_points: {
        relation: Model.HasManyRelation,
        modelClass: Point,
        join: {
          from: 'maps.id',
          to: 'map_points.map_id',
        }
      }
    }
  }
}

export default MapModel
