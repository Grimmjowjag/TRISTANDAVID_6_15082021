const express = require('express')
const bodyPaser = require('body-parser')
const mongoose = require('mongoose');

const Thing = require('./models/thing');

const app = express()

mongoose.connect('mongodb+srv://triton0074:noobolife75zz@cluster0.tb4tx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Premier Middleware éxécuté par le serveur (permet à l'application d'accéder à l'API sans problème depuis n'importe quelle origine)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
  })

app.use(bodyPaser.json())

app.post('/api/stuff', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body
  })
  thing.save()
    // Création de ressources avec le code 201
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }))
  })

// Mise à jour du "Thing" (premier argument) grâce à "updateOne()" qui permet de modifier nos objets
app.put('/api/stuff/:id', (req, res, next) => {
  // Utilisation du paramètre "id" remplacé par "Thing" passé comme second argument
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }))
})

// On passe un objet à "deleteOne()" correspondant au document à supprimer
app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }))
})

// Récupération de l'id de l'objet grâce à "findOne()" pour trouver le "Thing" ayant le même "_id" que le paramètre de la requête
app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }))
  })

// Récupération de l'url de l'API
app.get('/api/stuff', (req, res, next) => {
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }))
})

module.exports = app

// ---- FIN CRUD (Create, Read, Update, Delete) ----