const express = require('express');
const router  = express.Router();

module.exports = (app) => {
    app.use('/client', router);

    router.get('/tranactionsHistory',userById);
};