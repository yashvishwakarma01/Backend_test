import express, { json } from 'express';
import cors from 'cors';
import { config } from "dotenv";
import cookieParser from 'cookie-parser';
import connect  from "./config/connect.js";
import auth  from './middleware/auth.js';
import Login from './controllers/login.controller.js';
import register from './controllers/register.controller.js';
import morgan from "morgan";
import fs from "fs";
import path from "path";
import logger from "./logger.js";
import postData from './controllers/post.controller.js';
import fetchData from './controllers/fetchData.js';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import validatePost from "./middleware/validatePost.js";
import errorHandler from './middleware/errorHandler.js';

config();
const app=express();
app.use(helmet());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: {
        message: "Too many requests from this IP, please try again later",
    },
});
app.use(limiter);
if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}


const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), { flags: "a" });

app.use(
    morgan("combined", {
        stream: accessLogStream, 
    })
);

app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(errorHandler)

app.post('/api/login',Login)
app.post('/api/signup',register)
app.post("/api/post",auth,postData)
app.get('/api/posts',auth,validatePost,fetchData)


const PORT=process.env.PORT || 8000

connect().then(()=>{
    app.listen(PORT,()=>{
        console.log("server is running on port 5000");

    })
}).catch((error)=>{
    logger.error("Server Connection Error", {
        error: error.message,
        stack: error.stack,
    });
    process.exit(1);
});

