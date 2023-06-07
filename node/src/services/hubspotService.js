const _ = require('lodash');
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client();

const { HUBSPOT } =  require('../model/config');
const   CLIENT_ID     = HUBSPOT.appId;
const   CLIENT_SECRET = HUBSPOT.secret;
const   REDIRECT_URI  = HUBSPOT.callbackUrl;
const   SCOPES        = HUBSPOT.scopes.split(/ |, ?|%20/).join(' ');

const GRANT_TYPES = {
  AUTHORIZATION_CODE: 'authorization_code',
  REFRESH_TOKEN: 'refresh_token',
};
//OAUTH====================
exports.getToken = async (code) => {
  return await hubspotClient.oauth.tokensApi.createToken(
    GRANT_TYPES.AUTHORIZATION_CODE,
    code,
    REDIRECT_URI,
    CLIENT_ID,
    CLIENT_SECRET);
};

exports.refreshToken = async (tokenStore,accessToken) => {
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
    accessToken = result.accessToken;
    hubspotClient.setAccessToken(tokenStore.accessToken);
};

exports.getAuthURL = async () => {
  return await hubspotClient.oauth.getAuthorizationUrl(
    CLIENT_ID,
    REDIRECT_URI,
    SCOPES
  );
};

exports.setAccessToken = async (accessToken) => {
  await hubspotClient.setAccessToken(accessToken);
};

const getFullName = (contactProperties) => {
    const firstName = _.get(contactProperties, 'firstname') || '';
    const lastName = _.get(contactProperties, 'lastname') || '';
    return `${firstName} ${lastName}`;
};

//CONTACTS ==========================
exports.prepareContactsContent = (contacts) => {
    return _.map(contacts, (contact) => {
      const companyName = _.get(contact, 'properties.company') || '';
      const name = getFullName(contact.properties);
      return { id: contact.id, name, companyName };
    });
};

exports.readContacts = async () => {
  const properties = ['firstname', 'lastname', 'company'];
  const OBJECTS_LIMIT = 30;
  return await hubspotClient.crm.contacts.basicApi.getPage(
  OBJECTS_LIMIT,
  undefined,
  properties
)};

exports.readContact = async(contactId) => {
  const properties = ["hs_object_id","email","password","commission","referral_credit","referral_code",];
  const associations = ["deals"];
  const archived = false;
  const id_property= 'email';
  try {
    return await hubspotClient.crm.contacts.basicApi.getById(
      contactId,
      properties,
      undefined,
      associations,
      archived,
      id_property);
  } catch (error) { return false };
};

exports.writeContact = async(data) => {
  let properties = {
    email          : data.email,
    password       : data.password,
    referral_code  : data.referral_code,
    commission     : data.commission,
    referral_credit: data.referral_credit
  };
  if(data.referred_by) { properties = {...properties, referred_by : data.referred_by}}
  try {
    return await hubspotClient.crm.contacts.basicApi.create({properties,associations:[]});
  } catch (e) {
    e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
  }
};

exports.updateContact = async(data) => {
  let properties = {
    password       : data.password,
    referral_code  : data.referral_code,
    commission     : data.commission,
    referral_credit: data.referral_credit
  };
  const contactId = data.contactID;
  if(data.referred_by) { properties = {...properties, referred_by : data.referred_by}}
  try {
    return await hubspotClient.crm.contacts.basicApi.update(contactId,{properties});
  } catch (e) {
    e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
  }
};

//DEALS================================
exports.getDeal = async (id) => {
  try {
      const dealId = id;
      const properties = [ "closedate", "amount" ];
      const propertiesWithHistory = undefined;
      const associations = undefined;
      const archived = false;
      const idProperty = undefined;
      // console.log('Calling crm.deals.basicApi.getById. Retrieve deal.');
      const dealsResponse = await hubspotClient.crm.deals.basicApi.getById(
          dealId,
          properties,
          propertiesWithHistory,
          associations,
          archived,
          idProperty
      );
      // logResponse('Request contact', req.contact);
      // logResponse('Response from API', dealsResponse);
      return {id    :dealsResponse.id,
              amount:dealsResponse.properties.amount,
              date  :dealsResponse.properties.closedate.split('T')[0]};

  }   catch      (e) {
      handleError(e,res);
  }
};

//FILES===========================
const   path     = require('path');
const   image    = path.join(__dirname, '../../resources/Bittrust.jpg');

exports.writeImage = async (data) => {
  const { hubspot,files,fileName } = data;
  let upload;
  files? upload = files : upload = image;
  const content       = await fileToBuffer(upload);
  const folderPath    = 'IDs';
  const option        = {
    access: 'PUBLIC_NOT_INDEXABLE',
    overwrite: true,
    duplicateValidationStrategy: 'NONE',
    duplicateValidationScope:'EXACT_FOLDER'
  };
  return await hubspot.files.upload({ content,fileName,folderPath,options:option});
};

//NOTES===========================
exports.writeNote = async (data) => {
  const { hubspot,photoID,contactID } = data;
  const   noteEngagement = {
    engagement  : { active: true, type: "NOTE" },
    associations: { contactIds: [contactID] },
    metadata    : { body: 'Attaching file to Deal.'},
    attachments : [ { id:photoID } ],
    json: true
  };
  return await hubspot.engagements.create(noteEngagement);
};

//OTHER===========================
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

function fileToBuffer (file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file.path || file, (err, data) => {
        if (err) return reject(err)
  
        resolve(data)
      })
    })
};