const express = require('express')
const router = express.Router()
const validator = require('../middleware/validator') 

// Controler pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/userCtrl')

// Création de deux routes "post" pour envoyer mail et mdp
router.post('/signup', validator, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router