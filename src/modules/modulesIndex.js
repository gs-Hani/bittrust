// const bodyParser      =  require('body-parser');
// const passportModule  = require('./passport');
const express = require('express');
const router  = require('../routes/routesIndex');

module.exports = async (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true,}));
    app.set('trust proxy', 1);

    // const { App,passport }  = passportModule(app);
    router( app );
    
    // Error Handler
    app.use((err, req, res, next) => {
        if(err) {
            throw (err);
        } else {
            console.log("Error handler");
            res.status(200);
        }
    });
};
