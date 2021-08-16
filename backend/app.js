const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user')

// Logique pour se connecter à MongoDB
mongoose.connect('mongodb+srv://triton0074:noobolife75zz@cluster0.tb4tx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

// ---- CORS (Cross-origin ressource sharing) ----
// Premier Middleware éxécuté par le serveur (permet à l'application d'accéder à l'API sans problème depuis n'importe quelle origine)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
  })

// pourquoi bodyParser est-il déprécié? --- ///!!!\\\ ---
app.use(bodyParser.json())

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/stuff', stuffRoutes)
app.use('/api/auth', userRoutes)

module.exports = app
