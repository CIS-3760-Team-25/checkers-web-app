require('dotenv').config();

import express from 'express';
import cors from 'cors';
import games from './routes/games';
import { ExpressLogger } from '../utils/log';

const app = express();
const { PORT } = process.env;

app.use(cors());
app.use(express.json());
app.use(ExpressLogger());

app.use(express.static('./build'));

app.post('/games', games.post);

app.listen(PORT, () => {
  console.log(`checkers-app - http://localhost:${PORT}`);
});
