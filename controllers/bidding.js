import Promise from 'bluebird'
import _ from 'lodash'
import * as db from '../helpers/db'

export const fetch = async(req, res, next, id) => {
  const { Bidding } = db.connect('luppa').connection.models
  req.entities = req.entities || {}

  req.entities.item = await Bidding.findOne({ _id: id })
  next()
}

export const findOne = async(req, res) => {
  if (req.entities) {
    const item = _.omit(await req.entities.item.toObject(), ['votes', 'item'])
    res.status(200).json(item)
  } else {
    res.status(404).json({ error: 'Item not found' })
  }
  res.end()
}

export const getAll = async(req, res) => {
  const { Bidding } = db.connect('luppa').connection.models
  const { page, limit } = req.query

  let query = {}
  let options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: '-score'
  }

  const documents = await Bidding.paginate(
    query,
    options,
    'biddings',
    async (bid) => await bid.toObject({ simplify: true })
  )

  res.status(200).json(documents)
  res.end()
}

export const vote = async(req, res) => {
  const user = req.body
  const bid = req.entities.item

  const voted = await bid.addVote({ user })

  res.status(200).json({ voted: true })
  res.end()
}
