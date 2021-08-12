const mongoose = require('mongoose')

// Création du schéma de données avec les champs requis
const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
})

// On exporte le modèle correspondant
module.exports = mongoose.model('Thing', thingSchema)