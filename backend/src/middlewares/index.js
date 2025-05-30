// Import middleware functions
import { errorHandler } from './error.middleware.js';
import { upload } from './multer.middleware.js';
import {
  extractRole,
  isUserRole,
  isPartnerRole,
  isAdminRole,
  isPartnerOrAdminRole,
} from './role.middleware.js';
import { checkAuthentication } from './auth.middleware.js';

/**
 * Export all middleware functions from a single entry point.
 * This makes it easier to import them in other parts of the application.
 */
export {
  errorHandler,
  upload,
  extractRole,
  isUserRole,
  isPartnerRole,
  isAdminRole,
  isPartnerOrAdminRole,
  checkAuthentication,
};
