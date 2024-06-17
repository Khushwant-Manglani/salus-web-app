import { logger } from './config/logger.js';
import { connectDB } from './db/index.js';

import dotenv from 'dotenv';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    logger.info('MONGODB Connected Successfully!');
  })
  .catch((err) => {
    logger.error('MONGODB Commection Failed: ', err);
  });
