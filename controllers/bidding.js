import * as db from '../helpers/db'

export const fetch = async(req, res, next, id) => {
  const { Bidding } = db.connect('luppa').connection.models
  req.entities = req.entities || {}

  let document = await Bidding.findOne({ _id: id })
  req.entities.item = document
  next()
}

export const findOne = async(req, res) => {
  const { Bidding } = db.connect('luppa').connection.models

  if (req.entities) {
    res.status(200).json(req.entities.item)
  } else {
    res.status(404).json({ error: 'Item not found '})
  }
  res.end()
}

export const getAll = async(req, res) => {
  const { Bidding } = db.connect('luppa').connection.models

  const documents = await Bidding.find({}, 'productName score orderType').sort('score')

  res.status(200).json(documents)
  res.end()
}

export const vote = async(req, res) => {

}

