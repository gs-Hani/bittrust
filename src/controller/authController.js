const { hash,logIn }                             = require('../services/authService');
const { writeContact,updateContact,readContact } = require('../services/hubspotService');                       

exports.signUp = async (req, res, next) => {
  try {
    // console.log('signUp req.body',req.body);
    const/*--------------*/{ email, password, referrer_link, contactID } = req.body;
    const data           = { email, password, referrer_link, contactID };
    const hashCode       =   await hash(password);
    const newData        = {...data,password:hashCode,commission:0.2,referral_credit:0};
    let   response;      
    if   (contactID) {
      response = await updateContact(newData);
    } else           {
      response = await writeContact(newData)
    };
    // console.log('signUp response.id',response.id);
    req.body = {...newData,contactID:response.id, referred_by:req.body.referred_by, portalID:req.body.portalID };
    next();
  } catch (err) {
    next  (err);
  }
};

exports.signIn = async (req, res, next) => {
  // console.log('signIn req.body',req.body);
  try {
    const data = req.body
    const account            = await logIn(data,readContact);
    req.body.id              = account.id;
    req.body.referral_credit = account.properties.referral_credit;
    if(account.associations) {
      req.body.deals = account.associations.deals.results;
    }
    next();
  } catch (err) {
    next  (err)
  }
};

exports.checkAvailability = async (req, res, next) => {
  // console.log('checkAvailability req.body',req.body);
  try {
    const { email }         = req.body; 
    const   existingContact = await readContact({email});
    // console.log('existingContact:',existingContact);
    if (!existingContact) {
      next();
    } else if(existingContact.properties.email && existingContact.properties.password != '') {
      const err = new Error('Email already in use');
            err.status = 409;
      throw err;
    } else if (existingContact.properties.email && existingContact.properties.password == '') {
      req.body.contactID = existingContact.id;
      next();
    }
  } catch (err) {
    next  (err);
  }
};

exports.signOut = async (req, res, next) => {
  try {
    
    req.logout(function(err) {
      if (err) { return next(err); }
      // console.log('signOut req.session',req.session);
      res.status(200).send(req.session);
    });

  } catch (err) {  
    next  (err);
  }    
};

exports.isAuthenticated = async (req,res,next) => {

  try {
    // console.log('isAuthenticated req.session.passport:',req.session.passport);
    // console.log('isAuthenticated req.user:',req.user);
    if (req.session.passport) {
      next()
    } else {
      res.sendStatus(401)
    }
    
  } catch (err) {
    next  (err);
  }
  
};

exports.refreshAccount = async (req,res,next) => {
  try {
    // console.log('refreshAccount req.session.passport.user:',req.session.passport.user);
    const account = await readContact(req.session.passport.user);
    req.user = {
      contactID: account.id, 
      email    : account.properties.email,
      deals    : account.associations.deals.results,
      credit   : account.properties.referral_credit
    };
    next();
  } catch (err) {
    next  (err)
  }
}