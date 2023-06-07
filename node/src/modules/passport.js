const   passport         = require('passport');   
const   LocalStrategy    = require('passport-local').Strategy;

module.exports = (app) => {
    // app.use(passport.authenticate('session'));

    passport.use(
        new LocalStrategy(async function (username, password, done) {
          try {
  
            const  valData = await validateSignIn({email:username, password});
            const  user    = await sign_in(valData);
            return done (null, user);
  
          } catch      (err) {
            return done(err);
          }
        })
    );
    
    return {App:app,passport};
};