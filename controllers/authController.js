
import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


// Function to generate token for login user 

const generateToken = (user)=>{
    // here we are integrating user role and Id in Token 
    return jwt.sign({id:user._id, role:user.role }, process.env.JWT_SECRET,{
        expiresIn:'15d'
   });
}

export const register = async(req, res) =>{
    console.log( 'Req body consoling : ',req.body);

    const {email, password, name, role, photo, gender} = req.body 
    try {
    let user = null
    if(role ==='patient'){
    user=await User.findOne({email})
    
    }
    else if(role=== 'doctor'){ 
    user =await Doctor.findOne({email})
    }

    

    // check is user exist 
    if(user) 
    { 
        res.status(400).json({
            success:false,
            message:"User  already Exist"
        })
    }

    // if no user found create a new user 
    // but first hash the password before creating 
    //* Hashing the password 
    const hashPassword = await bcrypt.hash(password,10);

 

    if(role ==="patient")
    {
        user =await  User.create({
            name,gender,email,password:hashPassword,photo,role
        })
        console.log("After creating : ", user);
    }

    
    if(role ==="doctor")
    {
        user = await  Doctor.create({
            name,gender,email,password:hashPassword,photo,role 
        })
    }

  

    res.status(200).json({
        success:true,
        message:"User created Successfully",
        userDetails: user

    })

 }
    

    catch (err) {
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Error while User Creation , try again "
        })

    }
    
}
    

    
    export const login = async (req, res) => {
 
        const {email} = req.body;
        console.log("Founded email is : ",email);
    try{
        // now this may be a doctor or a user 
        // so search in both db collections
         let user = null;
            const patient = await User.findOne({email});
            const doctor = await Doctor.findOne({email});

            if(patient)
            {
                console.log("user found");
                user = patient
            }

            if(doctor)
            {
                user = doctor
            }

            // check if no user is found 
            if(!user)
            {
               return res.status(404).json({seccess:false,
                    message:"No User Exist"
                }
                )
            }

             
             


            // If user found then check that provided password matches the stored password or not  
             const isPasswordMatch = await bcrypt.compare(req.body.password,user.password);


             if(!isPasswordMatch)
             {
                res.status(404).json({
                    success:false,
                    message:"Invalid Email or Password !!"
                })
             } 

             console.log("Password mathced ho ggya hai ");

           
      
                // generate token function 
                const token = generateToken(user);

                console.log(user._doc);
               
                // destructure the user object for some fields 

                const {appointments, role,password ,...rest} =user._doc   //TODO: what is rest object ????
             
              
                res.status(200).json({
                    success:true,
                    message:"LoggedIn Successfully !! ",
                    token:token,
                    data:{...rest},
                    role
             
                }) 
  
    } catch (err) {
        res.status(500).json({
             sussess:false,
             message:"failed to Login",  
             
        })
    }
     
}  