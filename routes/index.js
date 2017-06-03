import express from 'express'
import bidding from './bidding'

const router = express()

router.use('/bidding', bidding)

export default router