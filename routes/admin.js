import { deleteAdmin, deleteCoAdmin, getAdmin, getAllAdmins, getAllCoAdmins, getCoAdmin, updateAdmin, updateCoAdmin } from '../controllers/adminController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'

import express from 'express'
const router = express.Router()

router.get('/getAdmin/:userId', authenticate, restrict(["admin", "coAdmin"]), getAdmin)
router.get('/getAllAdmins', authenticate, restrict(["admin"]), getAllAdmins)
// router.delete('/deleteAdmin/:userId', authenticate, restrict(["admin"]), deleteAdmin)
router.put('/updateAdmin/:userId', authenticate, restrict(["admin"]), updateAdmin)

router.get('/getCoAdmin/:userId', authenticate, restrict(["admin", "coAdmin"]), getCoAdmin)
router.put('/updateCoAdmin/:userId', authenticate, restrict(["admin", "coAdmin"]), updateCoAdmin)
router.get('/getAllCoAdmins', authenticate, restrict(["admin"]), getAllCoAdmins)
router.delete('/deleteCoAdmin/:userId', authenticate, restrict(["admin"]), deleteCoAdmin)

export default router