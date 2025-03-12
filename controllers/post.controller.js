import Post from "../models/userPost.js";
import logger from "../logger.js"; 

    const postData=async (req, res) => {
    try {
        const { userId, postName, description, tags, imageUrl } = req.body;

       
        if (!userId || !postName || !description) {
            return res.status(400).json({ message: "Missing required fields" });
        }

       
        if (req.user.id !== userId) {
            return res.status(403).json({ message: "Forbidden: Cannot post on behalf of another user" });
        }

       
        const newPost = new Post({
            userId,
            postName,
            description,
            tags,
            imageUrl,
        });

        await newPost.save();

        logger.info("Post created successfully", { userId, postName });

        return res.status(201).json({ message: "Post created successfully", post: newPost });

    } catch (error) {
        logger.error("Error creating post", { error: error.message });

        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default postData;
