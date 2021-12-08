"use strict"

const validator = require('validator')

module.exports = (req, res, next) => {
  try {
    // Vérification que la requête correspond bien à celle du token -> password valide ou non
    // Si validator est false
    if (!validator.isStrongPassword(req.body.password)) {
        console.log('veuillez utiliser un mot de passe au bon format')
        res.status(401).json({error: 'veuillez utiliser un mot de passe au bon format'})
    // Format requis: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    } else {next()}
  } catch {
    res.status(500).json({
      error: "erreur serveur"
    })
  }
}