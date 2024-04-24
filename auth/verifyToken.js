import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

// designed middleware to authenticate and authorized the request before execution based on their Token

export const authenticate = async (req, res, next) => {
  // get token from header
  const authToken = req.headers.authorization;
  // console.log("recieved token is : ", authToken);

  // we are especting a token like 'Bearer...' formate

  if (!authToken || !authToken.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "No token,authorization Denied ",
    });
  }

  // now verify the token if it is available

  try {
    // console.log(authToken);
    const token = authToken.split(" ")[1];

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if token verify successfully , req object me userid and role ko add kr do so that it can later used by subsequent fxns

    req.userId = decoded.id;
    req.role = decoded.role;

    // console.log("assigned role and id is  : ", req.role,req.userId);

    next();
  } catch (err) {
    console.log("Error in token verification !!");
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token is Expired " });
    }

    return res.status(401).json({ success: false, message: "Invalid Token " });
  }
};

// Creating middleware to authenticate admin

// here roles will be passed as an array of designeted roles that are permited on the route
export const restrict = (roles) => async (req, res, next) => {
  // take userId from req, that is added by previous authentication middleware
  const userId = req.userId;
  let user;

  // find this user in both collection , Doctor and user

  const patient = await User.findById(userId);

  const doctor = await Doctor.findById(userId);

  if (patient) {
    user = patient;
  }

  if (doctor) {
    user = doctor;
  }

  if (!roles.includes(user.role)) {
    return res
      .status(401)
      .json({ success: false, message: "You are not Authorized " });
  }

  // console.log("restict middleware approved for user : ",user);
  next();
};
