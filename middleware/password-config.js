const passwordValidator = require("password-validator"); // vérifier le format du MDP

const passwordSchema = new passwordValidator();

passwordSchema
    .is()
    .min(5) // Minimum 5 caractères
    .is()
    .max(25) // Maximum 25 caractères
    .has()
    .uppercase() // minimum 1 majuscule
    .has()
    .lowercase() // minimum 1 minuscule
    .has()
    .digits(2) // minimum 2 chiffres
    .has()
    .not()
    .spaces() // ne doit pas contenir d'espace
    .is()
    .not()
    .oneOf(["Passw0rd1", "Password123", "Azerty123", "Motdepasse123"]); // ne doit pas être une de ces propositions

    module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({
            error:
            "Le mot de passe doit avoir une longueur de 5 à 25 caractères avec au moins un chiffre, une minuscule, une majuscule et ne possédant pas d'espace" ,
        });
    }
}; 