import Post from '../models/userPost.js'
import logger from '../logger.js';

const postService=async({userId,postName,description,tags,imageUrl})=>{
     try{

    const newPost = new Post({userId,postName,description,tags,imageUrl});
    const response=await newPost.save();
    if(response){
        logger.info("Post created successfully", { userId, postName });
        return {ok:true,data:response}
    }
    return {ok:false}
  }catch(error){
    logger.error("Error creating post", { error: error.message });
}  
    

}

export default postService;