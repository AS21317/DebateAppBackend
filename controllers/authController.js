import User from "../models/UserSchema.js";
import Host from "../models/HostSchema.js";
import Admin from "../models/AdminSchema.js";
import HostApplication from "../models/HostApplicationSchema.js";
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
    let host = await Host.findOne({ user: userId });
    if(host){
      return res.status(404).send({ success: false, message: "Host already exists." });
    }

    const updatedHostApplication = await HostApplication.findOneAndUpdate(
      { user: userId },
      { status: "approved" },
      { new: true }
    )

    if(!updatedHostApplication){
      return res.status(404).send({ success: false, message: "Host Application not found." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId,
      { role: "host" },
      { new: true }
    ).select("-password");

    if(!updatedUser){
      return res.status(404).send({ success: false, message: "User not found." });
    }

    host = await Host.create({ 
      user: userId,
      expertise: updatedHostApplication.expertise,
    });
    
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
    let admin = await Admin.findOne({ user: userId });
    if(admin){
      return res.status(400).send({ status: false, message: "Admin already exists." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId,
      { role: "admin" },
      { new: true }
    ).select("-password")

    if(!updatedUser){
      return res.status(404).send({ status: false, message: "User not found." });
    }

    admin = await Admin.create({ user: updatedUser._id });

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
    const updatedUser = await User.findByIdAndUpdate(userId,
      { role: "coAdmin" },
      { new: true }
    ).select("-password")

    if(!updatedUser){
      return res.status(404).send({ status: false, message: "User not found." });
    }

    const coAdmin = await Admin.create({ user: updatedUser._id });

    res.status(200).send({ status: true, message: "Successfully Registered as coAdmin!", data: updatedUser })
    console.log("CoAdmin Registered Successfully!")
  }catch(err){
    console.log("Error while registering coAdmin: ", err);
    res.status(500).send({ status: false, message: "Error while registering for coAdmin." });
  }
}
