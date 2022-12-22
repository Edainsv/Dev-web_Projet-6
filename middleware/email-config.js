const validator = require("validator"); // vérifie le format du mail

module.exports = (req, res, next) => {
const { email } = req.body;

if (validator.isEmail(email)) {
        next();
    } else {
        return res.status(400).json({ error: `Email ${email} is invalid` });
    }
};