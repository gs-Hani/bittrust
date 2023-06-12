const { updateContact } = require('../services/hubspotService');
const { hash }    = require('../services/authService');

exports.updateProfile = async(req,res,next) => {
  console.log('updateProfile req.body',req.body);
  try {
    const/*----------*/{ email, newPassword, password, contactID } = req.body;
    const hashCode = await hash(newPassword||password);
    const newData  = { email, password:hashCode, contactID };
    const response = await updateContact(newData);
    console.log(response);
    res.status(200).send(response);
  } catch (err) {
    next  (err)
  }
};
