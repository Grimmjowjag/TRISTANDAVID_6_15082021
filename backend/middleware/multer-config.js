"use strict"

// Package qui gère les fichiers envoyé à l'API via les requêtes
const multer = require('multer')

// Gestion des formats reçus du front 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

// Objet de configuration
const storage = multer.diskStorage({
  // Indique à Multer dans quel dossier enregistrer les fichiers
  destination: (req, file, callback) => {
    // Si il n'y a pas d'erreur, enregistrer dans le dossier /images
    callback(null, 'images')
  },
  // Générer un nouveau nom pour le fichier.
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + '.' + extension)
  }
})

module.exports = multer({storage: storage}).single('image')