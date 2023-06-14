const { updateContact,readContact } = require('../services/hubspotService');                 
const { hash }    = require('../services/authService');

exports.updateProfile = async(req,res,next) => {
  try {
    console.log('updateProfile req.body',req.body);
    const/*----------*/{ email, newPassword, contactID } = req.body;
    const hashCode = await hash(newPassword);
    const newData  = { email, password:hashCode, contactID };
    const response = await updateContact(newData);
    console.log(response);
    res.status(200).send(response);
  } catch (err) {
    next  (err)
  }
};

exports.checkReferrer = async(req,res,next) => {
  console.log('checkReferrer req.body',req.body);
  try {
    const {referred_by,portalID} = req.body
    if   (!referred_by) { next() } 
    else {
      const referrerAccount = await readContact({referred_by});
      console.log('referrer account:',referrerAccount.id);
      if(!referrerAccount) {
        const err = new Error('Incorrect referral code');
              err.status = 404;
        throw err;
      } else {
        req.body.referrer_link = `https://app.hubspot.com/contacts/${portalID}/contact/${referrerAccount.id}`
        next()
      }
    }
  } catch (err) {
    next  (err) 
  }
};