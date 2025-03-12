import Joi from "joi";

const postSchema = Joi.object({
    userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.pattern.base": "Invalid userId format",
        "any.required": "userId is required",
    }),
    postName: Joi.string().min(3).required().messages({
        "string.empty": "Post name cannot be empty",
        "string.min": "Post name must be at least 3 characters long",
    }),
    description: Joi.string().min(10).required().messages({
        "string.empty": "Description cannot be empty",
        "string.min": "Description must be at least 10 characters long",
    }),
    uploadTime: Joi.date().default(() => new Date()),
    tags: Joi.array().items(Joi.string()).optional(),
    imageUrl: Joi.string().uri().optional().messages({
        "string.uri": "Invalid image URL",
    }),
});

const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map(err => err.message),
        });
    }
    next();
};

export default validatePost;
