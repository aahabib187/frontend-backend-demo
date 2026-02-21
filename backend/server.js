require('dotenv').config();
const express = require('express');
const oracledb = require('oracledb');
const cors =require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);

const connectDB = require('./db/connection');

app.get('/test', async (req, res) => {
  try {
    const connection = await connectDB();
    const result = await connection.execute(`SELECT * FROM dual`);
    await connection.close();
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});