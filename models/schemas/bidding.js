import mongoose from 'mongoose'
import baseSchema from './plugins/base';

const Schema = mongoose.Schema

const schema = new Schema({
  productAlias: { type: String, required: true },
  orderType: { type: String },
  avaazUrl: { type: String, default: '' },
  supports: [{
    googleId: { type: String },
    name: { type: String },
    email: { type: String },
    cep: { type: String },
    country: { type: String },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' } //lon, lat
    }
  }]
})

schema.virtual('name').get(function() {
  return this.productAlias
})

schema.virtual('type').get(function() {
  let aux = this.orderType.toLowerCase()
  aux = aux.replace(/ /gi, '-')

  return aux
})

schema.virtual('numberSupports').get(function() {
  if (this.votes) {
    return this.votes.length
  } else {
    return 0
  }
})

// Plugins
schema.plugin(baseSchema);

export default schema
