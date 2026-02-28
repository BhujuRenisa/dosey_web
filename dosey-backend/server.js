require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const medicineRoutes = require('./routes/medication');
const historyRoutes = require('./routes/history');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicines', medicineRoutes);
app.use('/api/history', historyRoutes);

// Sync Database and Start Server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Postgres Database Synced');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ Database Sync Error:', err));