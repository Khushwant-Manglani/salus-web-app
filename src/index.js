import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
import { logger } from './config/logger.js';
import { app } from './app.js';

// Load environment variables from .env file
dotenv.config({
  path: './.env',
});

// function to start the server
const startServer = () => {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    logger.info(`⚙️  Server is running on port: ${port}`);
  });
};

// connect to MongoDB and start the server
connectDB()
  .then(() => {
    // handle MongoDB connection errors
    app.on('error', (err) => {
      logger.error('MongoDB Connection Failed: ', err);
    });

    // start the server after MongoDb Connection Successful
    startServer();
  })
  .catch((err) => {
    // handle initial MongoDB connection errors
    logger.error('MongoDB Connection Failed: ', err);
    process.exit(1); // Exit process on connection failure
  });
