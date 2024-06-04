import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongoConnection = async () => {
    try {
        const user = process.env.MONGODB_USER;
        const pwd = process.env.MONGODB_PASSWORD;
        const url = process.env.MONGODB_URL;
        const db = process.env.MONGODB_DB;

        if (!user || !pwd || !url || !db) {
            throw new Error('Missing environment variables for MongoDB connection');
        }

        await mongoose.connect(
            `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`
        );
        console.log('Mongo connection successfully established!');
    } catch (e) {
        console.log('Error while setting up mongo connection', e);
        throw e;
    }
};