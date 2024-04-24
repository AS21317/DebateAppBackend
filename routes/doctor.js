import express from 'express'
const router = express.Router()
import { deleteDoctor,getAllDoctor,getSingleDoctor,updateDoctor,doctorProfile } from '../controllers/DoctorController.js'

// middlewares
import { authenticate,restrict } from '../auth/verifyToken.js'

import reviewRouter from './review.js'
//nested route with router.use() fxn 

router.use('/:doctorId/reviews',reviewRouter)  //doctor ke aage agr aisi route pr req aaye to review router pr chali jaye 
//this doctorId , is availabble in parent route not in chile/review route , we need to access it by enabeling mergeParams true in review route 

router.delete('/:id',authenticate,restrict(['doctor']),deleteDoctor) 
router.put('/:id',authenticate,restrict(['doctor']),updateDoctor)
router.get('/:id',authenticate,restrict(['doctor','patient']),getSingleDoctor)
router.get('/',getAllDoctor)
router.get('/profile/me',authenticate,restrict(['doctor']),doctorProfile) 

export default router;

