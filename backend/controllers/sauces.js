const Sauce = require('../models/sauceModel')
const fs = require('fs')

// ---- Début CRUD  ----

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }))
}

// Récupération de l'id de l'objet grâce à "findOne()" pour trouver le "Sauce" ayant le même "_id" que le paramètre de la requête
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {res.status(200).json(sauce)})
  .catch((error) => {res.status(404).json({error: error})})
}

// Mise à jour du "Sauce" (premier argument) grâce à "updateOne()" qui permet de modifier nos objets
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      // JSON.parse(req.body.sauce) -> imageUrl:etc... remplace l'url de notre requête
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
  // Utilisation du paramètre "id" remplacé par "Sauce" passé comme second argument
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // updateOne récupère l'id dans la base de données
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }))
}
 
// On passe un objet à "deleteOne()" correspondant au document à supprimer
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // On extrait le nom du fichier à supprimer
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getAllSauces = (req, res, next) => 
{Sauce.find().then((sauce) => 
  {res.status(200).json(sauce)})
  .catch((error) => {res.status(400).json({error: error})
    })
}

// ---- FIN CRUD (Create, Read, Update, Delete) ----