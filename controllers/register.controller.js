import User from "../models/userModel.js";
import { genSalt, hash } from 'bcryptjs';

const register=async(req,res)=>{
    try{
     const {name,email,password}=req.body;
     
    if(!name){
        return res.status(400).json({
            message:"Please fill name",
            error:true,
            success:false
        })
    }
    if(!email){
        return res.status(400).json({
            message:"Please fill email",
            error:true,
            success:false
        })
    }
    if(!password){
        return res.status(400).json({
            message:"Please fill password",
            error:true,
            success:false
        })
    }

     const userExist=await User.findOne({email});
     if(userExist){
        return res.status(401).json({
        message:"User already exist",
        error:true,
        success:false
        
       })
     }

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);
    const payload={
        name,
        email,
        password:hashPassword
    }
     const user=new User(payload);
     await user.save();
     return res.status(201).json({message:"User created successfully",success:true});
    }catch(error){
        logger.error("Response Error", {
            error: error.message,
            stack: error.stack,
        });
        return res.status(500).json({
        message: error.message || "Error in registering the user",
        error:true,
        success:false
    })
}

}

export default register;