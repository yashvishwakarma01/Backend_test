import jwt from "jsonwebtoken"

const auth=async(req,res,next)=>{
try{
 
  const accessToken=req.cookies?.accessToken || req?.headers?.authorization.split(" ")[1];
  
  if(!accessToken){

    return res.status(401).json({
        message:"User is not logged",
        error:true,
        success:false
    })
  }
  const decoded=await jwt.verify(accessToken,process.env.JWT_SECRET_KEY);
  
  if(decoded.id){
    req.user={id:decoded.id,email:decoded.email};
  }
  next();
}catch(error){
  logger.error("Auth Error", {
    error: error.message,
    stack: error.stack,
});
     res.status(500).json({
        message:"Internal Server Error",
        error:true,
        success:false
     })
}
}

export default auth;