const { hash,ref,comparePasswords }            = require('../services/authService');
const { writeContact,updateContact,readContact } = require('../services/hubspotService');                       

exports.signUp = async (req, res, next) => {
  console.log('signUp req.body',req.body);
  try {
    const/*-------------------------------*/{ email, password, referred_by, contactID } = req.body;
    const/*------------------------*/data = { email, password, referred_by, contactID };
    const hashCode       = await hash(password);
    const referral_code  = await ref();
    const newData        = {...data,password:hashCode,referral_code,commission:0.2,referral_credit:0}
    const response       = contactID ? await updateContact(newData):  await writeContact(newData);
    console.log('signUp response.id',response.id);
    req.body = {...newData,contactID:response.id};
    next()
  } catch (err) {
    next  (err);
  }
};

exports.signIn = async (req, res, next) => {
  console.log('signIn req.body',req.body);
  try {
    const {contactID, email, password} = req.body;
    const account = await readContact(contactID || email);
    console.log(account);
    if (!account || account.properties.password == null) {
      const err        = new Error('No account with such email was found!');
            err.status = 404;
      throw err
    };

    if (!comparePasswords(password,account.properties.password)) {
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
    const   existingContact = await readContact(email);
    console.log(existingContact);
    if (!existingContact) {
      next();
    } else if(existingContact.properties.email && existingContact.properties.password != '') {
      const err = new Error('Email already in use');
            err.status = 409;
      throw err;
    } else if (existingContact.properties.email && existingContact.properties.password == '') {
      req.body.contactID = existingContact.id;
    }
    next();
  } catch (err) {
    next  (err);
  }
};