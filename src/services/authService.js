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
  try {
    const  matchFound  = await bcrypt.compare(password,hash);
    return matchFound;
  } catch (err) {
    throw  err;
  }
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

module.exports = {
    hash,
    ref,
    isAuthorized,
    isTokenExpired,
    comparePasswords
};