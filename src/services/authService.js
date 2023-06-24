const _      = require('lodash');
const bcrypt = require("bcrypt");

const passwordHash = async (password) => {

    const saltRounds = Math.ceil(Math.random() * 19 );
  
    try {

      const  salt = await bcrypt.genSalt(saltRounds);
      const  hash = await bcrypt.hash(password,salt);
      return hash;

    } catch (err) {
      throw  err;
    }

};

const comparePasswords = /*----------*/async (password,hash) => {
  const  matchFound    = await bcrypt.compare(password,hash);
  console.log('comparePasswords results:',matchFound);
  return matchFound ;
};

function generateRefCode () {
    const length  = 6;
    const charset = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
    let refCode = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      refCode += charset.charAt(Math.floor(Math.random() * n));
    }
    return refCode;
};

async function hash (password) {
    try {

      return await passwordHash(password);
      
    } catch (err) {
      throw  err;
    }
    
};

async function ref () {
  try {
           
    return generateRefCode();

  } catch (err) {
    throw (err)
  }
};

function isAuthorized (tokenStore) {
    return !_.isEmpty(tokenStore.refreshToken);
};
  
function isTokenExpired (tokenStore) {
    return Date.now() >= tokenStore.updatedAt + tokenStore.expiresIn * 1000;
};

async function logIn (data,readContact) {
  try {
    const {contactID, email, password} = data;
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

    return account

  } catch (error) {
    throw (error)
  }
};

module.exports = {
    hash,
    ref,
    isAuthorized,
    isTokenExpired,
    comparePasswords,
    logIn
};