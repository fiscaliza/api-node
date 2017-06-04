import schema from './schemas/bidding'
import _ from 'lodash'

const _transformObject = schema.options.toObject.transform;

export const model = (connection) => {
  schema.methods.addVote = async function ({ user } = {}) {
    const Bid = this.model('Bidding')

    console.log(this.votes)
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

    console.log(this.votes)

    return true
  }

  schema.options.toObject.transform = async(doc, ret, options) => {
    let transformed = _.clone(await _transformObject(doc, ret, options));
    return transformed
  }

  return connection.model('Bidding', schema)
};