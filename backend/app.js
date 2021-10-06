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


// ---- CORS (Cross-origin ressource sharing) ----
// Premier Middleware éxécuté par le serveur (permet à l'application d'accéder à l'API sans problème depuis n'importe quelle origine)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message:"Too many requests, please try after 15 minutes"
})

//  apply to all requests
app.use(limiter)

// Logique pour se connecter à MongoDB
const mongooseConnect= `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tb4tx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(mongooseConnect,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(bodyParser.json())

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
