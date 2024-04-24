import express from 'express'
const router = express.Router()
import { deleteUser,getAllUser,getMyAppointment,getSingleUser,getUserProfile,updateUser } from '../controllers/userController.js'
import { authenticate,restrict } from '../auth/verifyToken.js'

// * Restict middleware me hm sare permissible roles ki array pass kr sakte hai 


router.delete('/:id',authenticate,restrict(['patient']),deleteUser)
router.put('/:id',authenticate,restrict(['patient']),updateUser)
router.get('/:id',authenticate,restrict(['patient']),getSingleUser)
router.get('/profile/me',authenticate,restrict(['patient']),getUserProfile)
router.get('/appointments/my-appointtments',authenticate,restrict(['patient']),getMyAppointment)
router.get('/',authenticate,restrict(['patient']),getAllUser)   //*  ==> Only admin is allowed  to see all users 

export default router; 