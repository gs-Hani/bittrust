const validator = require('validator');

exports.validateSignIn = async(data) => {

    const { email, password } = data;
    
  //sanitization -----------------------------------
    if (!validator.isEmail(email)) {
      const err = new Error('Please insert a valid email address');
            err.status = 401;
      throw err;
    } else {
      const  valData = { email, password };
      return valData;
    }
};