const express = require('express');
const router  = express.Router();

const { checkAvailability,signUp,
        signOut,isAuthenticated,refreshAccount } = require('../controller/authController');
const { getDeals, uploadImage, photoNote, 
        getPortalID, referrerNote }              = require('../controller/hubspotController');
const { checkReferrer }                          = require('../controller/profileController');

module.exports = (app,passport) => {
    app.use('/auth', router);

    router.post('/signUp'   ,checkAvailability, getPortalID, checkReferrer, signUp, uploadImage, photoNote,referrerNote);
    router.post('/signIn'   ,passport.authenticate('local'), getDeals);
    router.post('/signOut'  ,signOut);
    router.get ('/checkauth',isAuthenticated, refreshAccount,getDeals);
}