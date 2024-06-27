// Import middleware functions
import { errorHandler } from './error.middleware.js';
import { upload } from './multer.middleware.js';
import { extractRole } from './role.middleware.js';

/**
 * Export all middleware functions from a single entry point.
 * This makes it easier to import them in other parts of the application.
 */
export { errorHandler, upload, extractRole };
