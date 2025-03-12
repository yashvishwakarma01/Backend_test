import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";


const logsDir = "logs"; 


const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, meta }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta ? JSON.stringify(meta) : ""}`;
    })
);


const logger = winston.createLogger({
    level: "info", 
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: path.join(logsDir, "application-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
        }),
    ],
});


export default logger;
