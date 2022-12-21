const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // delete req.body._id;

    console.log(req.body);

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${ // permet de générer l'url de l'image
            req.file.filename
        }`,
    });
    sauce.save()
     .then(() => res.status(201).json({ message: 'Sauce créée !' }))
     .catch((message) => res.status(400).json({ message }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
     .then(sauces => res.status(201).json(sauces))
     .catch()
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
     .then(sauces => res.status(201).json(sauces))
     .catch();
};




