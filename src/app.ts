require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ExpressLogger } = require('./utils/log');

const app = express();
const { PORT } = process.env;

app.use(cors());
app.use(express.json());
app.use(ExpressLogger());

app.use(express.static('./build'));

app.listen(PORT, () => {
  console.log(`checkers-app - http://localhost:${PORT}`);
});
