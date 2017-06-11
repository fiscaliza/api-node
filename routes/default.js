import express from 'express'
import Package from '../package.json'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    project: 'Luppa',
    version: Package.version,
    description: "We're watching you steal!"
  })
  res.end()
})

export default router
