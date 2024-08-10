import { Model } from 'objection'

// TODO: types as strings not ideal?

// biome-ignore lint/complexity/noStaticOnlyClass: Objection.js model
class  SessionModel extends Model {
  static tableName = 'sessions'

  static jsonSchema = {
    type: 'object',
    required: [ 'sid' ],
    properties: {
      sid: { type: 'string' },
      sess: { type: 'string' },
      expired: { type: 'string' }
    }
  }
}

export default SessionModel
