const express = require('express')
const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet")
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const sauceRoutes = require('./routes/saucesroutes')
const userRoutes = require('./routes/user')
const app = express()


// ---- CORS (Cross-origin ressource sharing nécéssaire ici car le front et le back ne partagent pas la même origine) ----

// Premier Middleware éxécuté par le serveur (permet à l'application d'accéder à l'API sans problème depuis n'importe quelle origine)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*') // "*" Permet l'accès à l'origine de notre API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization') // Autorisation des headers spécifiés
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS') // Autorisation des requêtes spécifiées
  next()
})

const rateLimit = require("express-rate-limit")
const { cp } = require('fs')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message:"Trop de requêtes effectuées, veuillez réessayer dans 15 minutes"
})

// Appliqué à toutes les requêtes
app.use(limiter)

// Logique pour se connecter à MongoDB
const mongooseConnect= `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tb4tx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(mongooseConnect,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

// Renforcement du mot de passe avec validator.js (test)
const validator = require('validator')

const userPassword = mongoose.model('userPassword',{
  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error('Veuillez entrer un mot de passe au bon format')
      }
    }
  }
})

app.use(bodyParser.json()) // bodyParser transforme le corps de la requête en JSON utilisable

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)
app.use(helmet())
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);},
    }),
)

module.exports = app
