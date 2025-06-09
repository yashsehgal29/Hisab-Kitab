import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/ratelimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
const app = express();
import cors from "cors";

//so the steps to set up the server are as follows:
//1. initialize the database
//2. create a get request to fetch all transactions
//3. create a post request to create a transaction
//4. create a put request to update a transaction
//5. create a delete request to delete a transaction
//6. check if the database is connected

dotenv.config();
const port = process.env.PORT || 8081;
//middleware
//wht it does is that it parses the body of the request and makes it available in the req.body object
app.use(rateLimiter);
app.use(express.json());
app.use(cors());


//rate limiting middleware i want 100 requests per 15 minutes


//initializing the database
async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        
        console.log("Connected to the database successfully!!!");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}

//creating a get request to fetch all transactions
app.use("/api/transactions", transactionsRoute);

//checking if the database is connected
initDB().then(() => { 
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
});
