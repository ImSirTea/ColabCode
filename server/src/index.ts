import express from 'express';
import session from 'express-session';
import serverConfig from '@/config';
import api from './api';

// Create an express server
const app = express();

// Use sessions to prevent need to log in
app.use(session({
  secret: serverConfig.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Use the API router
app.use('/api', api);

// Run the server
const port = process.env.PORT ?? 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
