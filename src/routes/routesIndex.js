const auth    = require('./authRoute');
const hubspot = require('./hubspotRoute');
const profile = require('./profileRoute');

module.exports = (app) => {
    auth         (app);
    hubspot      (app);
    profile      (app);
};