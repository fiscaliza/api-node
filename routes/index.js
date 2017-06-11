import express from 'express'
import bidding from './bidding'
import apiDefault from './default'

const router = express()

router.use('/bidding', bidding)
router.use('/', apiDefault)

export default router
