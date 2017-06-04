import schema from './schemas/bidding'
import _ from 'lodash'

const _transformObject = schema.options.toObject.transform;

export const model = (connection) => {
  schema.options.toObject.transform = async(doc, ret, options) => {
    let transformed = _.clone(await _transformObject(doc, ret, options));
    return transformed
  }

  return connection.model('Bidding', schema)
};