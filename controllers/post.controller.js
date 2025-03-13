import Post from "../models/userPost.js";
import logger from "../logger.js"; 
import postService from "../services/post.service.js";


    const postData=async (req, res) => {
    try {
        const {postName, description, tags, imageUrl } = req.body;

       const userId=req.user.id;
        if (!userId || !postName || !description) {
            return res.status(400).json({ message: "Missing required fields" });
        }

       
        if (req.user.id !== userId) {
            return res.status(403).json({ message: "Forbidden: Cannot post on behalf of another user" });
        }

       const response=await postService({userId, postName, description, tags, imageUrl});
       if(response.ok){
        return res.status(201).json({ message: "Post created successfully", post: response.data });
       }    
        return res.status(500).json({message:"Post created unsuccessful",error:true,success:false});

    } catch (error) {
        logger.error("Error creating post", { error: error.message });

        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default postData;
