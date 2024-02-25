import { Model } from 'objection'

// biome-ignore lint/complexity/noStaticOnlyClass: Objection.js model
class  SessionModel extends Model {
  static tableName = 'sessions'

  static jsonSchema = {
    type: 'object',
    required: [ 'sid' ],
    properties: {
      sid: { type: 'string' },
      sess: { type: 'json' },
      expired: { type: 'datetime' }
    }
  }
}

export default SessionModel
