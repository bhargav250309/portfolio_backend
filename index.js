import app from "./src/app.js";
import { config } from "dotenv";
import dbConnection from "./src/db/dbConnection.js";

config();

const databaseConnection = async () => {
    try {
        await dbConnection();

        // Start the server
        app.listen(process.env.PORT,"0.0.0.0" ,() => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed: ", error);
        process.exit(1);
    }
}

databaseConnection();