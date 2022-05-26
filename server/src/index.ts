import express, { NextFunction, Request, Response } from 'express';
import api from '@/api';

// Create an express server
const app = express();

// Make sure body content as text is interpreted properly
app.use(express.text());
app.use(express.json());

const allowCrossDomain = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};

app.use(allowCrossDomain);

// Use the API router
app.use('/api', api);

// Static website providing
app.use(express.static('static', { extensions: ['html'] }));

app.use('/assets', express.static('assets'));

// Run the server
const port = process.env.PORT ?? 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
