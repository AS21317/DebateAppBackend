import express from 'express'
const router = express.Router()

import { authenticate, restrict } from '../auth/verifyToken.js'
import { deleteHost, getAllHosts, getHost, updateHost } from '../controllers/hostController.js'

// router.use('/:hostId/reviews', reviewRouter)  //host ke aage agr aisi route pr req aaye to review router pr chali jaye 
// //this hostId, is availabble in parent route not in child/review route , we need to access it by enabeling mergeParams true in review route 
router.get('/getAll', getAllHosts)

router.delete('/delete/:id', authenticate, restrict(['host', 'admin', 'coAdmin']), deleteHost)
router.put('/update/:id', authenticate, restrict(['host', 'admin', 'coAdmin']), updateHost)
router.get('/:id', getHost)

export default router;

