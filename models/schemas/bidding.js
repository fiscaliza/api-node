import mongoose from 'mongoose'
import baseSchema from './plugins/base';

const Schema = mongoose.Schema

const schema = new Schema({
  productAlias: { type: String, required: true },
  orderType: { type: String },
  votes: { type: Array }
})

schema.virtual('id').get(function() {
  return this._id
})

schema.virtual('name').get(function() {
  return this.productAlias
})

schema.virtual('type').get(function() {
  let aux = this.orderType.toLowerCase()
  aux = aux.replace(/ /gi, '-')

  return aux
})

schema.virtual('numberVotes').get(function() {
  if (this.votes) {
    return this.votes.length
  } else {
    return 0
  }
})

// Plugins
schema.plugin(baseSchema);

export default schema