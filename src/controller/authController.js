const { hash,ref,comparePasswords }            = require('../services/authService');
const { writeContact,updateContact,readContact } = require('../services/hubspotService');                       

exports.signUp = async (req, res, next) => {
  try {
    console.log('signUp req.body',req.body);
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
    console.log('signUp response.id',response.id);
    req.body = {...newData,contactID:response.id, referred_by:req.body.referred_by, portalID:req.body.portalID };
    next();
  } catch (err) {
    next  (err);
  }
};

exports.signIn = async (req, res, next) => {
  console.log('signIn req.body',req.body);
  try {
    const {contactID, email, password} = req.body;
    const account = await readContact({contactID, email});
    console.log('sign in account:',account);
    if (!account || account.properties.password == null) {
      const err        = new Error('No account with such email was found!');
            err.status = 404;
      throw err
    };

    const match = await comparePasswords(password,account.properties.password)

    if (!match) {
      const err        = new Error('Password is incorrect');
            err.status = 401;
      throw err;
    }

    if(account.associations) {
      req.body.deals = account.associations.deals.results;
    }
    next();
  } catch (err) {
    next  (err)
  }
};

exports.checkAvailability = async (req, res, next) => {
  console.log('checkAvailability req.body',req.body);
  try {
    const { email }         = req.body; 
    const   existingContact = await readContact({email});
    console.log('existingContact:',existingContact);
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