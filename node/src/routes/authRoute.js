const express = require('express');
const router  = express.Router();

const { signUp } = require('../controller/authController');
const { getContact,getDeals } = require('../controller/hubspotController');
const { uploadImage, createNote } = require('../controller/hubspotController');

module.exports = (app) => {
    app.use('/auth', router);

    router.post('/signUp' ,signUp, uploadImage, createNote);
    router.post('/signIn' ,getContact,getDeals);
}