import Post from "../models/userPost.js"

const deletePost=async(req,res)=>{
   try{
    const {postId}=req.body;
    const data=await Post.findOneAndDelete({_id:postId});
    console.log(data)
    if(data){
        return res.status(200).json({"message":"post deleted successfully",ok:true})
    }else if(data === null){
        return res.status(400).json({ok:false,message:"Post already deleted"});
    }
    return res.status(500).json({ok:false,message:"Error in deleting post"});
}catch(error){
     console.log(console.log(error.message));
}
}

export default deletePost;