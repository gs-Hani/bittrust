const express = require('express');
const router  = express.Router();
const { uploadImage,getLatestDeals }   = require('../controller/hubspotController');
const { signIn }        = require('../controller/authController');
const { updateProfile } = require('../controller/profileController');

module.exports = (app) => {
    app.use('/profile', router);

    router.post('/uploadImage'  ,uploadImage);
    router.put ('/updateProfile',signIn,updateProfile);
    // router.get ('/updateCredit', getLatestDeals)
};