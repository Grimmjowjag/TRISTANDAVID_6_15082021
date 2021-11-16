"use strict"

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création du nouvel utilisateur avec un email et un mot de passe crypté
        const user = new User({
          email: req.body.email,
          password: hash
        })
        // On enregistre notre utilisateur
        user.save()
        // et on renvoie un message pour confirmer l'enregistrement de notre user
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(500).json({ error }))
  }

// Connection des utilisateurs existants
exports.login = (req, res, next) => {
    // On essaie de trouver un seul utilisateur de la base de donnée
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' })
        }
        // On compare le mot de passe envoyé avec la requête avec le "hash" enregistré dans notre doc user
        bcrypt.compare(req.body.password, user.password)
        // On vérifie si la comparaison est valable ou non -> bon/mauvais mdp
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' })
            }
            // On renvoie un statut "200" pour une bonne connection avec un userId et un token encodé/crypté (permet la connection)
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          // Erreur possible avec MongoDB -> erreur serveur 500
          .catch(error => res.status(500).json({ error }))
      })
      .catch(error => res.status(500).json({ error }))
  }