const _ = require('lodash');

exports.refreshToken = async (hubspotClient,GRANT_TYPES,CLIENT_ID,CLIENT_SECRET,tokenStore) => {
    const result = await hubspotClient.oauth.tokensApi.createToken(
      GRANT_TYPES.REFRESH_TOKEN,
      undefined,
      undefined,
      CLIENT_ID,
      CLIENT_SECRET,
      tokenStore.refreshToken
    );
    tokenStore = result;
    tokenStore.updatedAt = Date.now();
    console.log('Updated tokens', tokenStore);
  
    hubspotClient.setAccessToken(tokenStore.accessToken);
};

const getFullName = (contactProperties) => {
    const firstName = _.get(contactProperties, 'firstname') || '';
    const lastName = _.get(contactProperties, 'lastname') || '';
    return `${firstName} ${lastName}`;
};

exports.prepareContactsContent = (contacts) => {
    return _.map(contacts, (contact) => {
      const companyName = _.get(contact, 'properties.company') || '';
      const name = getFullName(contact.properties);
      return { id: contact.id, name, companyName };
    });
};

exports.logResponse = (message, data) => {
    console.log(message, JSON.stringify(data, null, 1));
};

exports.handleError = (e, res) => {
    if (_.isEqual(e.message, 'HTTP request failed')) {
      const errorMessage = JSON.stringify(e, null, 2);
      console.error(errorMessage);
      return res.redirect(`/error?msg=${errorMessage}`);
    }
  
    console.error(e);
    res.redirect(
      `/error?msg=${JSON.stringify(e, Object.getOwnPropertyNames(e), 2)}`
    );
};

const fs = require('fs');

exports.fileToBuffer = (file) => {
    return new Promise((resolve, reject) => {
      fs.readFile(file.path, (err, data) => {
        if (err) return reject(err)
  
        resolve(data)
      })
    })
};