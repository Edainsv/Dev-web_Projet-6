const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // Génère l'url
        likes: 0,
        dislikes: 0
    });

    sauce.save()
     .then(() => res.status(201).json({ message: 'Sauce créée !' }))
     .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
     .then(sauces => res.status(201).json(sauces))
     .catch((error) => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
     .then((sauce) => res.status(201).json(sauce))
     .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
     .then((sauce) => {
        // Vérifie d'abord si le produit parcourou correspond à l'utilisateur connecté, sinon on jette.
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé' });
        } else {
            const fileName = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${fileName}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                 .then(() => { res.status(200).json({ message: 'Sauce supprimées !' })})
                 .catch(error => res.status(401).json({ error }));
            });
        }
     })
     .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
     .then((sauce) => {
        // Vérifie d'abord si le produit parcourou correspond à l'utilisateur connecté, sinon on jette.
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé' });
        } else {
            let saveImageUrl = sauce.imageUrl; // Pour conserver l'url de l'image en cours.
            const fileName = sauce.imageUrl.split('/images/')[1];
            
            // Si req.file existe c'est que l'utilisateur souhaite modifier l'image.
            if (req.file) {
                fs.unlink(`images/${fileName}`, () => {});

                // Enregistre la nouvelle image
                const sauceObject = req.file ? {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
                } : { ...req.body };

                // Met à jour la base de données
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                 .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                 .catch((error) => res.status(400).json({ error: "Sauce non modifiée !" }));
            } else {
                const newItem = req.body;
                newItem.imageUrl = saveImageUrl;

                // Met à jour la base de données
                Sauce.updateOne({ _id: req.params.id }, { ...newItem, _id: req.params.id })
                 .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                 .catch((error) => res.status(401).json({ error: "Sauce non modifiée !" }));
            }       
        }
     })
     .catch((error) => res.status(400).json({ error }));
};

exports.likeOrDislike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
     .then((sauce) => {
        let like = req.body.like;

        switch (like) {
        // Aujoute un Like
        case 1:
            // Si pas de like on ajoute
            if (!sauce.usersLiked.includes(req.body.userId)) {
                sauce.usersLiked.push(req.body.userId);
                sauce.likes++;
            }
            break;

        // Ajoute un Dislike
        case -1:
            // Si pas de dislike on ajoute
            if (!sauce.usersLiked.includes(req.body.userId)) {
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes++;
            }
            break;

        // Annule le like ou dislike
        case 0:
            // Si le Like existe, on le retire pour l'utilisateur connecté.
            if (sauce.usersLiked.includes(req.body.userId)) {
                index = sauce.usersLiked.indexOf(req.body.userId); // Récupère la position.
                sauce.usersLiked.splice(index, 1);
                sauce.likes--;
            }

            // Si le dislike existe, on le retire pour l'utilisateur connecté.
            if (sauce.usersDisliked.includes(req.body.userId)) {
                index = sauce.usersDisliked.indexOf(req.body.userId); // Récupère la position.
                sauce.usersDisliked.splice(index, 1);
                sauce.dislikes--;
            }
            break;
        }

        sauce.save()
         .then(() => res.status(200).json({ message: "Sauce évaluée !" }))
         .catch((error) => res.status(400).json({ error: "Impossible d'évaluer la sauce" }));
     })
     .catch((error) => res.status(400).json({ error }));
};
