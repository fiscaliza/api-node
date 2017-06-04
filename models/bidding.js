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

  schema.methods.createPetition = ({ user }) => {

  }

  schema.methods.updatePetition = ({ user }) => {

  }

  schema.options.toObject.transform = async(doc, ret, options) => {
    let transformed = _.clone(await _transformObject(doc, ret, options));
    return transformed
  }

  return connection.model('Bidding', schema)
};