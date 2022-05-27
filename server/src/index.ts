import express from 'express';
import cors from 'cors';
import api from '@/api';

// Create an express server
const app = express();

// Make sure body content as text is interpreted properly
app.use(express.text());
app.use(express.json());
app.use(cors());

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
