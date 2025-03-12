import { connect as _connect } from "mongoose";
import { config } from "dotenv";
config();

const connect=async()=>{
       try{
        await _connect(process.env.MONGODB_URI);
        console.log("Database connected...")
       }catch(error){
        logger.error("Database Connection Error", {
            error: error.message,
            stack: error.stack,
        });
       }
}
 export default connect;