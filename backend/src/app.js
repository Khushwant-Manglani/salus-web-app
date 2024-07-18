import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { errorHandler } from './middlewares/error.middleware.js';
import { REQ_BODY_SIZE_LIMIT } from './constants.js';
import keys from './config/keys.js';

const { CorsOrigin, Session } = keys;

// Initialize the Express app
const app = express();

/**
 * Middleware Setup
 *
 * 1. CORS: Configured to allow requests from specific origins and include credentials
 * 2. Body Parsers: Configured to parse JSON and urlencoded data with size limits.
 * 3. Cookie Parser: Configured to handle cookie operations.
 * 4. Static Files: Serves static files from the 'public' directory.
 */

// Use CORS middleware to allow requests from specific origins and include credentials(ensures cookies and authentication headers are included in cors)
app.use(
  cors({
    origin: CorsOrigin,
    credentials: true,
  }),
);

// Configured the app to parse JSON data with specified size limits.
app.use(express.json({ limit: REQ_BODY_SIZE_LIMIT }));
// Configured the app to parse urlencoded data with specified size limits.
app.use(express.urlencoded({ extended: true, limit: REQ_BODY_SIZE_LIMIT }));
// Use cookieParser middleware handle cookie operations
app.use(cookieParser());
// use express static middleware for serving the static files from the public folder
app.use(express.static('public'));

// session configuration
app.use(
  session({
    secret: Session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: Session.cookie.maxAge,
    },
  }),
);

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

// routes imports
import userRouter from './routes/user.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import authRoutes from './routes/auth.routes.js';

// routes declarations
app.use('/api/v1/user', userRouter);
app.use('/api/v1/partner', partnerRoutes);
app.use('/api/v1/user/auth', authRoutes);
app.use('/api/v1/partner/auth', authRoutes);
app.use('/api/v1/admin/auth', authRoutes);

// global error handler middleware
app.use(errorHandler);

export { app };
