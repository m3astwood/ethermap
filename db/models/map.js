import { Model } from 'objection'
import Point from './point.js'

class MapModel extends Model {
  static tableName = 'maps'

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
