const express = require('express');

const app = express();

app.use((req, res, next) => {
	res.json({message:'Requête reçue !'});
	next();
});

app.use((req, res, next) => {
	console.log("T'es trop beau :)");
});
module.exports = app;