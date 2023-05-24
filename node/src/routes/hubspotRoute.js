const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { checkEnv,
        getContacts,
        authorize,
        getAccesstoken,
        emptyTokenStore,
        refreshAuthpage 
} = require('../controller/hubspotController');

module.exports = (app) => {
    app.use(express.static(path.join(__dirname, '../public')));
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../views'));
    app.use(bodyParser.urlencoded({
            limit: '50mb',
            extended: true,})
    );
    app.use(bodyParser.json({
            limit: '50mb',
            extended: true,})
    );
    app.use(checkEnv);
    app.get('/', getContacts);
    app.use('/oauth', authorize);
    app.use('/oauth-callback',getAccesstoken );
    app.get('/login', (req, res) => { emptyTokenStore; res.redirect('/'); });
    app.get('/refresh',refreshAuthpage);
    app.get('/error', (req, res) => { res.render('error', { error: req.query.msg }); });
    app.use((error, req, res) => { res.render('error', { error: error.message }); });
}