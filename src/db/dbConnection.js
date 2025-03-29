import mongoose from "mongoose";
import { config } from "dotenv";

config();

const dbConnection = async () => {
    try {
        const DbPath = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB: ${DbPath.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default dbConnection;