const auth    = require('./authRoute');
const hubspot = require('./hubspotRoute');
const profile = require('./profileRoute');

module.exports = (app,passport) => {
    auth         (app,passport);
    hubspot      (app);
    profile      (app);
};