import mongoose from "mongoose";
import seedDatabase from "./seedDatabase";
import dotenv from 'dotenv';

dotenv.config();
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/reservations';

const MongoConnect = async () => {
    try {
        await mongoose.connect(dbUri);
        seedDatabase()
      } catch (error) {
        console.error(error);
    }
}

export default MongoConnect