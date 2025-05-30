const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

dotenv.config();

const destinationsRouter = require('./routes/destinations');
const usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

logger.info('Attempting to connect to MongoDB', { uri: process.env.MONGODB_URI });

mongoose.connect(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  },
  dbName: 'globetrotter'
})
  .then(() => {
    logger.info('Successfully connected to MongoDB');
  })
  .catch(err => {
    logger.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

app.use('/api/destinations', destinationsRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server started successfully`, {
      port: PORT,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });
}

module.exports = app;
