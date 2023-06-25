const express = require('express');

const morgan       = require('morgan');
const errorHandler = require('errorhandler');

// const cors        =  require('cors');
// const corsOptions = {
//   origin:'http://localhost:3000', 
//   credentials:true,            //access-control-allow-credentials:true
//   preflightContinue:true,
//   optionSuccessStatus:200,
// };

const session = require("express-session");
// const store   = new session.MemoryStore(); // used in development only !!!

const helmet  = require('helmet');

const { SECRET, NODE_ENV } = require('../model/config');
const { pool }           = require('../model/modelIndex');

module.exports = (app) => {

    if (NODE_ENV === 'development') {
        app.use(morgan('dev'));
        app.use(errorHandler());
    }
    // app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true,}));
    app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
    app.set('trust proxy', 1);

    app.use(
        session({
          secret           : SECRET,
          resave           : false,
          saveUninitialized: false,
          store: new (require('connect-pg-simple')(session))({
            pool:pool,
            createTableIfMissing:true,
          })
            //   store
        })
    );
      
    return app;
};