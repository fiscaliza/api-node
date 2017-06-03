import express from 'express'
import * as controller from '../controllers/bidding'

const router = express.Router()

const fetchParam = ':id';
router.param('id', controller.fetch);

router.get('/', controller.getAll)
router.get(`/${fetchParam}`, controller.findOne)

router.post(`/${fetchParam}/vote`, controller.vote)

export default router