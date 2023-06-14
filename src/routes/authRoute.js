const express = require('express');
const router  = express.Router();

const { checkAvailability,signUp,signIn }   = require('../controller/authController');
const { getDeals, uploadImage, photoNote, 
        getPortalID, referrerNote }         = require('../controller/hubspotController');
const { checkReferrer }                     = require('../controller/profileController');

module.exports = (app) => {
    app.use('/auth', router);

    router.post('/signUp' ,checkAvailability, getPortalID, checkReferrer, signUp, uploadImage, photoNote,referrerNote);
    router.post('/signIn' ,signIn, getDeals);
}