const hashAndRef = require('../services/authService');
const createContact = require('./hubspotController');

exports.signUp = async (req, res, next) => {

    try {
      const/*--------------------------------*/{ firstName, lastName, email, password } = req.body;
      const/*-------------------------*/data = { firstName, lastName, email, password };
      const newData  = await hashAndRef(data);
      const response = createContact(newData);
      res.status(200).send(response);
    } catch (err) {
      next  (err);
    }

};