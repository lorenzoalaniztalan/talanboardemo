const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const notasRoutes = require('./routes/notas');

// Generar un nuevo sessionId cada vez que se inicia el servidor
const sessionId = uuidv4();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true
}));
app.use(express.json());

// Middleware para verificar el sessionId
app.use((req, res, next) => {
  const clientSessionId = req.headers['x-session-id'];
  if (clientSessionId && clientSessionId === sessionId) {
    next();
  } else {
    res.status(403).json({ message: 'Sesión inválida' });
  }
});

// Routes
app.use('/api/notas', notasRoutes);

// Nueva ruta para obtener el sessionId
app.get('/api/session', (req, res) => {
  res.json({ sessionId });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
