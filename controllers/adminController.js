import Admin from "../models/AdminSchema.js";


/* Controllers for Admin */

export const getAllAdmins = async (req, res) => {
    console.log("Get All Admins Called")
    console.log("Req: ", req.body)

    try {
        const admins = await Admin.find({ role: "admin" })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'host',
                select: '-gToken'
            })
            .populate({
                path: 'events',
            })
        
        if(!admins){
            return res.status(404).send({ success: false, message: "No admin found" })
        }
        
        res.status(200).send({ success: true, message: "All admins fetched successfully", data: admins })
        console.log("All Admins Fetched Successfully !!"
    )
    } catch (error) {
        console.log("Error while fetching all admins: ", error)
        res.status(500).send({ success: false, message: "Error while fetching all admins" })
    }
}


export const getAdmin = async (req, res) => {
    console.log("Get Admin Called")
    console.log("Req: ", req.body)

    const userId = req.params.userId
    try {
        const admin = await Admin.findOne({ user: userId, role: "admin" })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'host',
                select: '-gToken'
            })
            .populate({
                path: 'events',
            })
        
        if(!admin){
           return res.status(404).send({ success: false, message: "No admin found with provided userId" })
        }
        
        res.status(200).send({ success: true, message: "Admin fetched successfully", data: admin })
    } catch (error) {
        console.log("Error while fetching admin: ", error)
        res.status(500).send({ success: false, message: "Error while fetching admin" })
    }
}


export const deleteAdmin = async (req, res) => {
    console.log("Delete Admin Called")
    console.log("Req: ", req.body)
    console.log("Params: ", req.params)

    const userId = req.params.userId
    try {
        const admin = await Admin.findOneAndDelete({ user: userId, role: "admin" })
        
        if(!admin){
            return res.status(404).send({ success: false, message: "No admin found with provided userId" })
        }
        
        res.status(200).send({ success: true, message: "Admin deleted successfully" })
    } catch (error) {
        console.log("Error while deleting admin: ", error)
        res.status(500).send({ success: false, message: "Error while deleting admin" })
    }
}


export const updateAdmin = async (req, res) => {
    console.log("Update Admin Called")
    console.log("Req: ", req.body)
    console.log("Params: ", req.params)
    const userId = req.params.userId
    try {
        const admin = await Admin.findOneAndUpdate(
                { user: userId, role: "admin" },
                { $set: req.body },
                { new: true }
            )
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'host',
                select: '-gToken'
            })
            .populate({
                path: 'events',
            })

        if(!admin){
            return res.status(404).send({ success: false, message: "No admin found with provided userId" })
        }

        res.status(200).send({ success: true, message: "Admin updated successfully", data: admin })
        console.log("Admin Updated Successfully !!")

    } catch (error) {
        console.log("Error while updating admin: ", error)
        res.status(500).send({ message: "Error while updating admin" })
    }
}



/* Controllers for CoAdmin */

export const getAllCoAdmins = async (req, res) => {
    console.log("Get All CoAdmins Called")
    console.log("Req: ", req.body)

    try {
        const coAdmins = await Admin.find({ role: "coAdmin" })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'host',
                select: '-gToken'
            })
            .populate({
                path: 'events',
            })
        
        if(!coAdmins){
            return res.status(404).send({ success: false, message: "No coAdmin found" })
        }
        
        res.status(200).send({ success: true, message: "All coAdmins fetched successfully", data: coAdmins })
        console.log("All CoAdmins Fetched Successfully !!")

    } catch (error) {
        console.log("Error while fetching all coAdmins: ", error)
        res.status(500).send({ success: false, message: "Error while fetching all coAdmins" })
    }
}


export const getCoAdmin = async (req, res) => {
    console.log("Get CoAdmin Called")
    console.log("Req: ", req.body)

    const userId = req.params.userId
    try {
        const coAdmin = await Admin.findOne({ user: userId, role: "coAdmin" })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'host',
                select: '-gToken'
            })
            .populate({
                path: 'events',
            })
        
        if(!coAdmin){
            return res.status(404).send({ success: false, message: "No coAdmin found with provided userId" })
        }
        
        res.status(200).send({ success: true, message: "CoAdmin fetched successfully", data: coAdmin })
        console.log("CoAdmin Fetched Successfully !!")

    } catch (error) {
        console.log("Error while fetching coAdmin: ", error)
        res.status(500).send({ success: false, message: "Error while fetching coAdmin" })
    }
}


export const deleteCoAdmin = async (req, res) => {
    const userId = req.params.userId
    console.log("Delete CoAdmin Called")
    console.log("Req: ", req.body)
    console.log("Params: ", req.params)

    try {
        const coAdmin = await Admin.findOneAndDelete({ user: userId, role: "coAdmin" })
        
        if(!coAdmin){
            return res.status(404).send({success: false,  message: "No coAdmin found with provided userId" })
        }
        
        res.status(200).send({ success: true, message: "CoAdmin deleted successfully" })
        console.log("CoAdmin Deleted Successfully !!")

    } catch (error) {
        console.log("Error while deleting coAdmin: ", error)
        res.status(500).send({ success: false, message: "Error while deleting coAdmin" })
    }
}


export const updateCoAdmin = async (req, res) => {
    const userId = req.params.userId
    console.log("Update CoAdmin Called")
    console.log("Req: ", req.body)
    console.log("Params: ", req.params)
    try {
        const coAdmin = await Admin.findOneAndUpdate(
                { user: userId, role: "coAdmin" },
                { $set: req.body },
                { new: true }
            )
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'host',
                select: '-gToken'
            })
            .populate({
                path: 'events',
            })

        if(!coAdmin){
            return res.status(404).send({ success: false, message: "No coAdmin found with provided userId" })
        }

        res.status(200).send({ success: true, message: "CoAdmin updated successfully", data: coAdmin })
    } catch (error) {
        console.log("Error while updating coAdmin: ", error)
        res.status(500).send({ success: false, message: "Error while updating coAdmin" })
    }
}