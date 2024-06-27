import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import { logger } from '../config/logger.js';
import keys from '../config/keys.js';

const { MongoUri } = keys;

/**
 * Connect to MongoDB database.
 *
 * This function connects to the MongoDB database using the connection string
 * from environment variables and the specified database name.
 * It logs the connection status and handles connection errors.
 *
 * @async
 * @function connectDB
 * @throws Will throw an error if the connection to MongoDB fails.
 */

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${MongoUri}/${DB_NAME}`);
    logger.info(
      `☘️  MongoDB Connected Successfully! DB host: ${connectionInstance.connection.host} \n`,
    );
  } catch (err) {
    logger.error('MongoDB Connection Failed: ', err);
    process.exit(1);
  }
};

export { connectDB };
