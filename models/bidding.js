import schema from './schemas/bidding'

export const model = (connection) => {
  return connection.model('Bidding', schema)
};