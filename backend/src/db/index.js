import mongoose from 'mongoose';
import {config}  from '../config/config.js';
import { DB_NAME } from '../constants/constants.js';

const connectDB = async () => {
    try {
        console.log(`${config.mongoose.url}/${DB_NAME}`);
        
        const connectionInstance = await mongoose.connect(
            `${config.mongoose.url}/${DB_NAME}`
        );
        console.log(
            `MongoDB Connected Successfully !!! Hostname : ${connectionInstance.connections[0]?.host}`
        );
    } catch (error) {
        console.log("MongoDB connection error : ", error);
        console.log("Exiting the program");
        process.exit(1);
    }
};

export default connectDB;
