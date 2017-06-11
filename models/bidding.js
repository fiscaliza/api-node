import schema from './schemas/bidding'
import Avaaz from '../helpers/avaaz'
import _ from 'lodash'

const _transformObject = schema.options.toObject.transform;

export const model = (connection) => {
  schema.methods.addVote = async function ({ user } = {}) {
    if (this.votes) {
      const isVoted = this.votes.filter(item => item.email === user.email).length > 0
      if (!isVoted) {
        this.votes.push(user)
      }
    } else {
      this.votes = []
      this.votes.push(user)
    }

    await this.save()
    return this.votes.length
  }

  schema.options.toObject.transform = async(doc, ret, options) => {
    if (options.simplify) {
      options.omit = [
        ...(options.omit || []),
        'votes',
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
