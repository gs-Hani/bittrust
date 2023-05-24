const admin  = require('./adminRoutes');
const auth   = require('./authRoutes')
const client = require('./clientRoutes');

module.exports = (app) => {
    admin        (app);
    auth         (app);
    // client       (app);
};