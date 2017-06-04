import * as db from '../helpers/db'

export const fetch = async(req, res, next, id) => {
  const { Bidding } = db.connect('luppa').connection.models
  req.entities = req.entities || {}

  const a = new Bidding({ name: 'All' })

  await a.save()

  req.entities.item = await Bidding.findOne({ _id: id })
  next()
}

export const findOne = async(req, res) => {
  if (req.entities) {
    console.log(req.entities)
    res.status(200).json({ item: req.entities.item })
  } else {
    res.status(404).json({ error: 'Item not found' })
  }
  res.end()
}

export const getAll = async(req, res) => {
  const { Bidding } = db.connect('luppa').connection.models

  const documents = await Bidding.find({}, 'productAlias score _id orderType').sort('score')
  console.log(documents)
  res.status(200).json(documents)
  res.end()
}

export const vote = async(req, res) => {

}

