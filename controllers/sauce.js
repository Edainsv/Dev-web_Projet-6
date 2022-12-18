const Sauce = require('../models/Sauce');

exports.sauceCreate = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
     .then(() => res.status(201).json({ message: 'Sauce créée !' }))
     .catch((message) => res.status(400).json({ message }));
};

exports.sauceList = (req, res, next) => {
    Sauce.find()
     .then(() => res.status(201).json({ message: 'La liste des sauces !'} ))
     .catch()
};
