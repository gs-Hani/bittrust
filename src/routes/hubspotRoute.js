const express = require('express');
const router  = express.Router();
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
    app.use('/activation', router);
    app.use(express.static(path.join(__dirname, '../public')));
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, '../views'));
    app.use(bodyParser.urlencoded({
        //     limit: '50mb',
            extended: true,})
        );
    app.use(bodyParser.json({
        //     limit: '50mb',
            extended: true,})
        );
    router.use(checkEnv);
    router.get('/', getContacts);
    router.use('/oauth', authorize);
    router.use('/oauth-callback',getAccesstoken );
    router.get('/login', (req, res) => { emptyTokenStore; res.redirect('/activation'); });
    router.get('/refresh',refreshAuthpage);
    router.get('/error', (req, res) => { res.render('error', { error: req.query.msg }); });
    router.use((error, req, res) => { res.render('error', { error: error.message }); });
}