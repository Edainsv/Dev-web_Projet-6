const multer = require('multer');  // package de gestion de fichier

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}

const storage = multer.diskStorage({ // Créé un objet de configuration pour multer pour enregistrer
    destination: (req, file, callback) => { // Destination d'enregistrement
        callback(null, 'images')
    },
    filename: (req, file, callback) => { // Nom de fichier utilisé
        const name = file.originalname.split(' ').join('_'); // remplaçe les espaces par des undescores
        const extension = MIME_TYPES[file.mimetype]; // créé l'extension
        callback(null, name + Date.now() + '.' + extension) // Nom du fichier
    }
});


module.exports = multer({ storage }).single('image'); // single pour signifier que c'est un fichier unique 