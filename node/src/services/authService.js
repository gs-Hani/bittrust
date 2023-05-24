const _ = require('lodash');

exports.isAuthorized = (tokenStore) => {
    return !_.isEmpty(tokenStore.refreshToken);
};
  
exports.isTokenExpired = (tokenStore) => {
    return Date.now() >= tokenStore.updatedAt + tokenStore.expiresIn * 1000;
};