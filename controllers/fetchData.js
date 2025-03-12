import express from "express";
import Post from "../models/userPost.js";
import logger from "../logger.js"; 


const fetchData=async (req, res) => {
    try {
        const { searchText, startDate, endDate, tags, page = 1, limit = 10 } = req.query;

        let query = {};

        if (searchText) {
            query.$or = [
                { postName: { $regex: searchText, $options: "i" } },
                { description: { $regex: searchText, $options: "i" } },
            ];
        }

     
        if (startDate || endDate) {
            query.uploadTime = {};
            if (startDate) query.uploadTime.$gte = new Date(startDate);
            if (endDate) query.uploadTime.$lte = new Date(endDate);
        }

        
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : tags.split(","); 
            query.tags = { $in: tagArray };
        }

   
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

      
        const posts = await Post.find(query)
            .sort({ uploadTime: -1 }) 
            .skip(skip)
            .limit(limitNum);

       
        const totalPosts = await Post.countDocuments(query);

        logger.info("Posts fetched successfully", { total: posts.length, filters: req.query });

        return res.status(200).json({
            message: "Posts fetched successfully",
            totalPosts,
            currentPage: pageNum,
            totalPages: Math.ceil(totalPosts / limitNum),
            posts,
        });
    } catch (error) {
        logger.error("Error fetching posts", { error: error.message });
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default fetchData;
