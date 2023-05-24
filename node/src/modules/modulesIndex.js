const router = require('../routes/routesIndex');


module.exports = async (app) => {
    router(app);
    
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