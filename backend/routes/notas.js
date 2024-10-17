const express = require('express');
const router = express.Router();
const Nota = require('../models/nota');

// Obtener todas las notas de la sesión actual
router.get('/', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    const notas = await Nota.find({ sessionId });
    res.json(notas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una nueva nota
router.post('/', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const nota = new Nota({
    ...req.body,
    sessionId
  });
  try {
    const nuevaNota = await nota.save();
    res.status(201).json(nuevaNota);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar una nota
router.patch('/:id', async (req, res) => {
  try {
    const nota = await Nota.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(nota);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar una nota
router.delete('/:id', async (req, res) => {
  try {
    await Nota.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nota eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
