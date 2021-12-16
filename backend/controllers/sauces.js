"use strict"

const Sauce = require('../models/sauceModel')
const fs = require('fs')

// ---- Début CRUD  ----

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id
  const sauce = new Sauce({
    // On récupère l'objet via le spread et on remplace l'image url en écrasant l'ancien fichier
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }))
}

// Récupération de l'id de l'objet grâce à "findOne()" pour trouver le "Sauce" ayant le même "_id" que le paramètre de la requête
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => {res.status(200).json(sauce)})
  .catch((error) => {res.status(404).json({error: error})})
}

// Mise à jour du "Sauce" (premier argument) grâce à "updateOne()" qui permet de modifier nos objets et de les mettre à jour
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file 
    ? //permet de vérifier si la requête contient une nouvelle image si req.file = true
    {
      ...JSON.parse(req.body.sauce), //S'il y a une nouvelle image, on parse avec ...JSON.parse
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } 
    : { ...req.body } // si false -> req.body

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // updateOne récupère l'id dans la base de données
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
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
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauce) => {res.status(200).json(sauce)})
  .catch((error) => {res.status(400).json({error: error})})
}

exports.likeSauce = (req, res, next) => {
    
  const like = req.body.like
  const userId = req.body.userId

  if (like === 1 ) {
      // $inc permet de rajouter une valeur à une donnée numérique
      Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: userId}}) 
          .then(() => res.status(200).json({message: 'Vous aimez cette sauce !'}))
          .catch(error => res.status(400).json({ error }))
  } else if (like === -1) {
      // $push permet de rajouter un nouvel élément à un tableau
      Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: userId}} )
          .then(() => res.status(200).json({message: "Vous n'aimez pas cette sauce !"}))
          .catch(error => res.status(400).json({ error }))
  } else if (like === 0) {
      Sauce.findOne({_id: req.params.id})
          .then((sauce) => {
              if (sauce.usersLiked.includes(userId)) {
                  // $pull permet de supprimer un élément
                  Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: userId}})
                   .then(() => res.status(200).json({message: "Vous n'aimez plus cette sauce !"}))
                   .catch(error => res.status(500).json({ error }))
              } if (sauce.usersDisliked.includes(userId)) {
                  Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
                   .then(() => res.status(200).json({message: "Vous aimez de nouveau cette sauce !"}))
                   .catch(error => res.status(500).json({ error }))
              }
          })
          .catch(error => res.status(500).json({ error }))
      }else {
        // Si le likescore n'est pas égal à 1/-1/0, l'app refuse la req
        return 'Erreur dans la gestion des likes'
      }
}

// ---- FIN CRUD (Create, Read, Update, Delete) ----