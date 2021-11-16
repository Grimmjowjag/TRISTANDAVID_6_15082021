"use strict"

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Cryptage des informations utilisateur stockées 
const userSchema = mongoose.Schema({
    // "unique: true" empêche l'utilsateur de s'inscrire plusieurs fois avec la même adresse mail
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)