import User from "../models/UserSchema.js";
import Host from "../models/HostSchema.js";
import Admin from "../models/AdminSchema.js";
import HostApplication from "../models/HostApplicationSchema.js";
import ExpertSchema from "../models/ExpertSchema.js";
import { sendEmail } from "./nodeMailer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Function to generate token for login user
const generateToken = (user) => {
  // here we are integrating user role and Id in Token
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};


export const registerUser = async (req, res) => {
  console.log("Register User Called: ", req.body)


  const { email, password, photo, ...rest } = req.body;
  try {
    let user = await User.findOne({ email });

    // check is user exist
    if (user) {
      return res.status(400).send({
        success: false,
        message: "User  already Exist",
      });
    }

    // if no user found create a new user
    // but first hash the password before creating
    //* Hashing the password
    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email,
      password: hashPassword,
      photo: photo ||  "http://res.cloudinary.com/dfyjwu1sh/image/upload/v1713792359/hipfc708glsely99zrck.png",
      ...rest,
    })
    
    user = await User.findById(user._id).select("-password");
    // console.log("After creating : ", user);

    res.status(200).send({
      success: true,
      message: "User created Successfully",
      userDetails: user,
    });
    console.log("User Created Successfully !!")
  } catch (err) {
    console.log("Error while registering the user: ", err);
    res.status(500).send({
      success: false,
      message: "Error while User Creation , try again ",
    });
  }
};


export const loginUser = async (req, res) => {
  console.log("Login User Called: ", req.body)

  const { email } = req.body;
  // console.log("Founded email is : ",email);
  try {
    const user = await User.findOne({ email });

    // check if no user is found
    if (!user) {
      return res.status(404).send({ seccess: false, message: "No User Exist" });
    }

    // If user found then check that provided password matches the stored password or not
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password !!",
      });
    }

    //  console.log("Password mathced ho ggya hai ");

    // generate token function
    const token = generateToken(user);

    // console.log(user._doc);

    // destructure the user object for some fields

    const { password, ...rest } = user._doc; //TODO: what is rest object ????

    res.status(200).send({
      success: true,
      message: "LoggedIn Successfully !! ",
      token: token,
      data: { ...rest },
      role: user.role,
    });
    console.log("User LoggedIn Successfully !!")
  } catch (err) {
    res.status(500).send({
      sussess: false,
      message: "failed to Login",
    });
  }
};


export const registerHost = async (req, res) => {
  const userId = req.params.id;
  console.log('Register Host Called with id: ', userId)

  try{
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).send({ success: false, message: "User not found." });
    }

    if(user.role === "host"){
      console.log("User is already a Host")
      return res.status(400).send({ success: false, message: "User is already a Host" });
    }

    let updatedHostApplication;
    if(user.role !== "admin" || user.role !== "coAdmin"){
        updatedHostApplication = await HostApplication.findOneAndUpdate(
        { user: userId },
        { status: "approved" },
        { new: true }
      )
      if(!updatedHostApplication){
        return res.status(404).send({ success: false, message: "Host Application not found." });
      }
    }

    let host = await Host.create({ 
      user: userId,
      expertise: updatedHostApplication.expertise || [],
    });

    const updatedUser = await User.findByIdAndUpdate(userId,
      { role: "host" },
      { new: true }
    ).select("-password");

    res.status(200).send({ success: true, message: "Successfully Registered Host!", data: updatedUser });
    console.log("Host Registered Successfully!")
  }catch(err){
    console.log("Error while registering host: ", err);
    res.status(500).send({ success: false, message: "Error while registering the host." });
  }
}


export const registerAdmin = async (req, res) => {
  const userId = req.params.id;
  console.log('Register Admin Called with id: ', userId)

  try{
    let user = await User.findById(userId);
    if(!user) {
      res.status(404).send({ success: false, message: "User not found" });
      console.log("User not found");
      return;
    }
    if(user.role === "admin"){
      res.status(400).send({ success: false, message: "User is already an Admin" });
      console.log("User is already an Admin");
      return;
    }

    const admin = await Admin.create({ user: user._id });

    const updatedUser = await User.findByIdAndUpdate(userId,
      { role: "admin" },
      { new: true }
    ).select("-password")

    res.status(200).send({ status: true, message: "Successfully Registered as Admin!", data: updatedUser })
    console.log("Admin Registered Successfully!")
  }catch(err){
    console.log("Error while registering admin: ", err);
    res.status(500).send({ status: false, message: "Error while registering for admin." });
  }
}


export const registerCoAdmin = async (req, res) => {
  const userId = req.params.id;
  console.log('Register CoAdmin Called with id: ', userId)

  try{
    let user = await User.findById(userId);
    if(!user) {
      res.status(404).send({ success: false, message: "User not found" });
      console.log("User not found");
      return;
    }
    if(user.role === "coAdmin" || user.role === "admin"){
      res.status(400).send({ success: false, message: "User is already a coAdmin or Admin" });
      console.log("User is already a coAdmin or Admin");
      return;
    }

    const coAdmin = await Admin.create({ user: user._id });

    const updatedUser = await User.findByIdAndUpdate(userId,
      { role: "coAdmin" },
      { new: true }
    ).select("-password")


    res.status(200).send({ status: true, message: "Successfully Registered as coAdmin!", data: updatedUser })
    console.log("CoAdmin Registered Successfully!")
  }catch(err){
    console.log("Error while registering coAdmin: ", err);
    res.status(500).send({ status: false, message: "Error while registering for coAdmin." });
  }
}


export const registerExpert = async (req, res) => {
  console.log("Create Expert Called: ", req.body);

  const userId = req.params.id;
  const { ...rest } = req.body;

  try {
      let user = await User.findById(userId);
      if(!user) {
          res.status(404).send({ success: false, message: "User not found" });
          console.log("User not found");
          return;
      }

      const expert = await ExpertSchema.findOne({ user: userId });
      if(expert) {
          res.status(400).send({ success: false, message: "Expert already exists" });
          console.log("Expert already exists");
          return;
      }

      const newExpert = new ExpertSchema({ user: userId, ...rest });
      const savedExpert = await newExpert.save()
      savedExpert.populate({
        "path": "user",
        "select": "-password"
      })

      user = await User.findByIdAndUpdate(userId, { role: "expert" }, { new: true }).select("-password");

      const subject = "Expert Profile Created";
      const text = `Dear ${user.name}, <br><br>

      We are thrilled to inform you that you have been promoted to the position of Expert within our community. This promotion is a testament to your dedication, expertise, and valuable contributions to our community.
      <br><br>

      As an Expert, you will play a crucial role in guiding and supporting other members, sharing your knowledge, and helping to foster a collaborative and enriching environment for everyone.
      <br><br>

      We have recognized your exceptional skills and commitment, and we are confident that you will continue to excel in your new role. Your insights and expertise will be instrumental in shaping the future of our community.
      <br><br>

      Please accept our heartfelt congratulations on this well-deserved promotion. We look forward to seeing the positive impact you will make as an Expert.
      <br><br>

      If you have any questions or need further information about your new role, please feel free to reach out to us. We are here to support you every step of the way.
      <br><br>

      Once again, congratulations on this achievement!
      <br><br>

      Best regards, <br>
      SpeakIndia Team <br>`

      await sendEmail(user.email, subject, text);

      res.status(200).send({ success: true, message: "Expert created successfully", data: { expert: savedExpert, user } });
      console.log("Expert Created Successfully !!");
  } catch (err) {
      console.log(err);
      res.status(500).send({ success: false, message: "Error while creating expert" });
  }
}