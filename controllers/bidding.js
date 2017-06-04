import mongoose from 'mongoose'
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
    console.log(req.entities)
    res.status(200).json({ item: _.omit(await req.entities.item.toObject(), ['votes']) })
  } else {
    res.status(404).json({ error: 'Item not found' })
  }
  res.end()
}

export const getAll = async(req, res) => {
  const { Bidding } = db.connect('luppa').connection.models

  const documents = await Bidding.find({}).sort('-score')

  let docs = await Promise.all(
    documents.map(async(item) => _.pick(await item.toObject(), ['id', 'name', 'type', 'score']))
  )

  res.status(200).json(docs)
  res.end()
}

export const vote = async(req, res) => {
  const { user } = req.body
  const bid = req.entities.item

  const voted = await bid.addVote({ user })

  res.status(200).json({ voted })
  res.end()
}