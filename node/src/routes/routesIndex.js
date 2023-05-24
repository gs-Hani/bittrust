const auth    = require('./authRoute');
const hubspot = require('./hubspotRoute');

module.exports = (app) => {
    auth         (app);
    hubspot      (app);
};