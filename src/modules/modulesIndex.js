const express_sessionModule = require('./express-session');
const passportModule        = require('./passport');
const router                = require('../routes/routesIndex');

module.exports = async (app) => {
    const   express_session = await express_sessionModule(app);
    const { App,passport }  = passportModule(express_session);
    router( App,passport );
    
    // Error Handler
    App.use((err, req, res, next) => {
        if(err) {
            res.status(err.status).send({"message": `${err.message}`});
        } else {
            console.log("Error handler");
            res.status(200);
        }
    });
};
