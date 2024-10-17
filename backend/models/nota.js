const mongoose = require('mongoose');

const notaSchema = new mongoose.Schema({
  contenido: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  color: { type: String, required: true },
  likes: { type: Number, default: 0 },
  emoji: { type: String, default: '' },
  usuario: { type: String, required: true },
  sessionId: { type: String, required: true, index: true }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índice compuesto para sessionId y createdAt
notaSchema.index({ sessionId: 1, createdAt: -1 });

// Virtual para la fecha formateada
notaSchema.virtual('fechaCreacion').get(function() {
  return this.createdAt.toLocaleDateString();
});

module.exports = mongoose.model('Nota', notaSchema);
