// const   fs       = require('fs');

// const   FormData = require('form-data');
// const   formData = new FormData();

const   path     = require('path');
const   image    = path.join(__dirname, '../../resources/Bittrust.jpg');

// const   Blob     = require('blob');
// const   blob     = new Blob(image);

const { hashAndRef }   = require('../services/authService');
const { writeContact } = require('../services/hubspotService');

exports.signUp = async (req, res, next) => {
    console.log('signUp req.body',req.body);
    try {
      const/*--------------------------------*/{ email, password } = req.body;
      const/*-------------------------*/data = { email, password };
      const newData  = await hashAndRef(data);
      const response = await writeContact(newData);
      console.log('signUp response.id',response.id);
      // formData.append("contactID", response.id);
      // formData.append("content",fs.readFileSync(image));
      // console.log('reading file done');
      req.body.contactID = response.id;
      next()
    } catch (err) {
      next  (err);
    }
};