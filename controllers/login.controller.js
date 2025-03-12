import User from "../models/userModel.js";
import { compare } from 'bcryptjs';
import jwt from "jsonwebtoken";

const Login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please enter both email and password"})
        }
    
        const user=await User.findOne({email});
       
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }
       
        const validatePassword=await compare(password,user.password)
        if(!validatePassword){
            return res.status(401).json({
                message:"Invalid email or password",
                error:true,
                success:false
            })
        }
     
        const accessToken=await jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET_KEY,{expiresIn:"24H"});
       
        res.cookie("accessToken",accessToken,{
            httpOnly:true,
            maxAge:24*60*60*1000,
        })

        return res.status(200).json({
            message:"Login successfully",
            accessToken:accessToken,
            error:false,
            success:true
        })

    }catch(err){
        logger.error("Response Error", {
            error: err.message,
            stack: err.stack,
        });
        return res.status({
            message:err.message || "Error in login",
            error:true,
            success:false
            
        });
    }
}

export default Login;