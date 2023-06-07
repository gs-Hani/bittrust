const express = require('express');
const router  = express.Router();

const { checkAvailability,signUp,signIn } = require('../controller/authController');
const { getDeals }                        = require('../controller/hubspotController');
const { uploadImage, createNote }         = require('../controller/hubspotController');

module.exports = (app) => {
    app.use('/auth', router);

    router.post('/signUp' ,checkAvailability, signUp, uploadImage, createNote);
    router.post('/signIn' ,signIn, getDeals);
}