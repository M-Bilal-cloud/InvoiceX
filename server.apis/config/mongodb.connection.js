import mongoose from 'mongoose';
import { MONGODB_URI_NET } from './config.js';


export const mongodbConnection = async () => {
    try{
        const conn = await mongoose.connect(MONGODB_URI_NET);
        console.log(`Database Connected Successfully: ${conn.connection.db.databaseName}`);
    } catch(error){
        console.log(`Database connection failed: ${error.message}`);
    }
};