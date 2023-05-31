const express = require('express');
const router  = express.Router();
const { uploadImage, createNote } = require('../controller/hubspotController');

module.exports = (app) => {
    app.use('/profile', router);

    router.post('/uploadImage',uploadImage,createNote);
};