const _ = require('lodash');
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client();

const { HUBSPOT }     =  require('../model/config');
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

exports.fetchPortalID = async (hubspot,token) => {
   const  response = await hubspot.oauth.getPortalInfo(token);
   return response.hub_id;
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

exports.readContact = async({contactID,email,referred_by}) => {
  console.log('readContact data:',{contactID,email,referred_by});
  const properties   = ["hs_object_id","email","password","commission","referral_credit","referred_by",];
  let   associations =  undefined ;
  let   id_property  =  undefined ;
  let   contactId    =  contactID ;
  if   (email)        { contactId = email      ; associations = ["deals"]; id_property="email" };
  if   (referred_by)  { contactId = referred_by};
  const archived     = false;
  
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
    commission     : data.commission,
    referral_credit: data.referral_credit
  };
  if(data.referrer_link) { properties = {...properties, referred_by : data.referrer_link}}
  try {
    console.log('writing contact...',properties);
    return await hubspotClient.crm.contacts.basicApi.create({properties,associations:[]});
  } catch (e) {
    e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
  }
};

exports.updateContact = async(data) => {
  console.log('updateContact data:',data);
  const { email, password, contactID:contactId, commission, referral_credit,referrer_link } = data;
  let properties   = { email, password };
  console.log('updateContact properties:',properties);
  if (commission)            { properties = { ...properties,commission,referral_credit } };
  if (referrer_link)         { properties = { ...properties,referred_by:referrer_link  } };
  if (referral_credit && 0 < Number(referral_credit)) { properties = { referral_credit } };
  try {
    console.log('updating contact...');
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
    console.log("getdeal id:",typeof id, id);
      const dealId                =    id;
      const properties            = [ "closedate", "amount", "buy9__profit", "sell9__profit", "dealname" ];
      const propertiesWithHistory =    undefined;
      const associations          = [ "contacts" ];
      const archived              =    false;
      const idProperty            =    undefined;
      const dealsResponse         =    await hubspotClient.crm.deals.basicApi.getById(
          dealId, properties, propertiesWithHistory, associations, archived, idProperty
      );
      console.log(dealsResponse);
      return {id       :dealsResponse.id,
              amount   :dealsResponse.properties.amount,
              date     :dealsResponse.properties.closedate.split('T')[0],
              profit   :dealsResponse.properties.buy9__profit || dealsResponse.properties.sell9__profit,
              dealName :dealsResponse.properties.dealname,
              contactID:dealsResponse.associations.contacts.results[0].id,
            };
              
  } catch      (e) {
    e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
  }
};

exports.readDeals = async (array) => {
  try {
    const BatchReadInputSimplePublicObjectId = {  properties: ["buy9__profit","sell9__profit"],
                                                  inputs: [...array] };
    const archived = false;
    const apiResponse = await hubspotClient.crm.deals.batchApi.read(BatchReadInputSimplePublicObjectId, archived);
    console.log(JSON.stringify(apiResponse, null, 2));
    return apiResponse;
  } catch      (e) {
    e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
  }
};

exports.searchDeals = async () => {
  try {
    const filter1 = { propertyName: 'closedate', operator: 'BETWEEN', value:`${Date.now() - 24*60*60*1000}` ,highValue: `${Date.now()}` };
    // const filter2 = { propertyName: 'associations.contact', operator: 'HAS_PROPERTY' }
    const filterGroups = { filters: [filter1] };
    const sort = JSON.stringify({ propertyName: 'closedate', direction: 'DESCENDING' });
    // const query = 'test';
    const properties = [];
    const limit = 100;
    const after = 0;
    const publicObjectSearchRequest = {
      filterGroups: [filterGroups],
      sorts: [sort],
      // query,
      properties,
      limit,
      after,
    }
    const result = await hubspotClient.crm.deals.searchApi.doSearch(publicObjectSearchRequest);
    console.log(result);
    return result;
  } catch      (e) {
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
  const { hubspot,photoID,contactID,portalID,referred_by } = data;
  console.log('writeNote data:',photoID,contactID,portalID,referred_by);
  let noteEngagement = {};
  if(referred_by) {
    noteEngagement = {
      engagement  : { active: true, type: "NOTE" },
      associations: { contactIds: [referred_by] },
      metadata    : { body: `https://app.hubspot.com/contacts/${portalID}/contact/${contactID}`},
      json: true
    };
  } else {
    noteEngagement = {
      engagement  : { active: true, type: "NOTE" },
      associations: { contactIds: [contactID] },
      metadata    : { body: `${contactID}`},
      attachments : [ { id:photoID } ],
      json: true
    };
  }
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