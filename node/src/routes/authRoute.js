const express = require('express');
const router  = express.Router();

const { getContact } = require('../controller/hubspotController');

module.exports = (app) => {
    app.use('/auth', router);

    router.post('/signIn',getContact);
}