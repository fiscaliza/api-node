import express from 'express'
import * as controller from '../controllers/bidding'

const router = express.Router()

const fetchParam = ':id';
router.param('id', controller.fetch);

router.get('/', controller.getAll)

router.post(`/${fetchParam}/vote`, controller.vote)
router.get(`/${fetchParam}`, controller.findOne)

export default router