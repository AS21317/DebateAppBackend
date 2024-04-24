import {createReview,getAllReview} from '../controllers/reviewController.js'
import { authenticate,restrict } from '../auth/verifyToken.js'

import express from 'express'
const router = express.Router({mergeParams:true})  //mergeparams will make available doctorid of parent route 

// we need to handle route like : doctor/doctorId/reviews  ===> for this we need to create nested routes 

router.get('/',getAllReview);
router.post('/doctor/:id/reviews',authenticate,restrict(['patient']),createReview )

export default router 