const express = require('express');
const db = require('./db-config');
const apiRoutes = require('./routes/api');

const app = express();


app.use(express.json());


app.use('/api', apiRoutes);


app.get('/health', async (req, res) => {
  const dbStatus = await db.checkConnection();
  res.json({
    status: 'OK',
    db: dbStatus ? 'connected' : 'disconnected'
  });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
