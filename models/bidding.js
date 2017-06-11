import schema from './schemas/bidding'
import _ from 'lodash'

const _transformObject = schema.options.toObject.transform;

export const model = (connection) => {
  schema.methods.addSupport = async function ({ user } = {}) {
    if (this.supports.length > 0) {
      const hasSupported = this.supports.filter(item => item.googleId === user.googleId).length > 0
      if (!hasSupported) {
        this.supports.push(user)
      }
    } else {
      this.supports = []
      this.supports.push(user)
    }

    await this.save()
    return this.supports.length
  }

  schema.options.toObject.transform = async(doc, ret, options) => {
    if (options.simplify) {
      options.omit = [
        ...(options.omit || []),
        'supports',
        'products',
        'biddingUrl',
        'orderNumber',
        'registerAt',
        'createdAt',
        'crawlerPrice',
        'totalPrice',
        'avaazUrl'
      ]
    }

    let transformed = _.clone(await _transformObject(doc, ret, options));
    return transformed
  }

  return connection.model('Bidding', schema)
};
