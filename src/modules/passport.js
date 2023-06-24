const   passport         = require('passport');   
const   LocalStrategy    = require('passport-local').Strategy;

const { logIn }          = require('../services/authService');
const { readContact }    = require('../services/hubspotService');
const { validateSignIn } = require('../utilities/validator');

module.exports = (app) => {
    app.use(passport.authenticate('session'));

    passport.use(
        new LocalStrategy(async function (username, password, done) {
          try {
            console.log('passport',username,password);
            const  valData = await validateSignIn({email:username, password});
            console.log('valData:',valData);
            const  account = await logIn(valData,readContact);
            const  user    = {
                      contactID: account.id, 
                      email    : account.properties.email,
                      deals    : account.associations.deals.results,
                      credit   : account.properties.referral_credit
            };
            console.log('user:',user);
            return done (null, user);
  
          } catch      (err) {
            return done(err);
          }
        })
    );

    passport.serializeUser((user, done) => {
      process.nextTick(function() {
        done(null, user);
      });
    });
      
    passport.deserializeUser(async (user,done) => {
      process.nextTick(function() {
        return done(null, user);
      });
    });
    
    return {App:app,passport};
};