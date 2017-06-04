import Promise from 'bluebird'
import * as db from '../helpers/db'

export const fetch = async(req, res, next, id) => {
  const { Bidding } = db.connect('luppa').connection.models
  req.entities = req.entities || {}

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

  const documents = await Bidding.find({}).sort('score')
  const pick = ['id', 'name', 'type']

  let docs = await Promise.all(
    documents.map(async(item) => await item.toObject())
  )

  res.status(200).json(docs)
  res.end()
}

export const vote = async(req, res) => {
  const { Bidding } = db.connect('luppa').connection.models
  const { user } = req.body

  res.status(200).json({ok:1})
  res.end()
}

