const express = require('express');
const router  = express.Router();

// const { signUp } = require('../controller/authController');
const { getContact,getDeals } = require('../controller/hubspotController');

module.exports = (app) => {
    app.use('/auth', router);

    // router.post('/signUp' ,signUp);
    router.post('/signIn' ,getContact,getDeals);
}