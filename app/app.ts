import express, { Request, Response } from 'express';
import morgan from 'morgan';
import logger from './logger';
import path from 'path';

const app = express();
const port = 3000;

// Use the logger middleware
app.use(morgan('dev'));

// define the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to log requests
app.use((req: Request, res: Response, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req: Request, res: Response) => {
  logger.info('Received request to /');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
