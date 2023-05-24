const _ = require('lodash');
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client();
const { isAuthorized,isTokenExpired }            = require('../services/authService');
const { refreshToken,prepareContactsContent,
        logResponse,handleError }                = require('../services/hubspotService');

const { HUBSPOT } =  require('../model/config');
const   CLIENT_ID     = HUBSPOT.appId;
const   CLIENT_SECRET = HUBSPOT.secret;
const   REDIRECT_URI  = HUBSPOT.callbackUrl;
const   SCOPES        = HUBSPOT.scopes.split(/ |, ?|%20/).join(' ');


exports.checkEnv = (req, res, next) => {
    if (_.startsWith(req.url, '/error')) return next();
  
    if (_.isNil(CLIENT_ID))
      return res.redirect(
        '/error?msg=Please set HUBSPOT_CLIENT_ID env variable to proceed'
      );
    if (_.isNil(CLIENT_SECRET))
      return res.redirect(
        '/error?msg=Please set HUBSPOT_CLIENT_SECRET env variable to proceed'
      );
  
    next();
};

let   tokenStore = {};

const GRANT_TYPES = {
    AUTHORIZATION_CODE: 'authorization_code',
    REFRESH_TOKEN: 'refresh_token',
};

const OBJECTS_LIMIT = 30;

exports.getContacts = async (req, res) => {
    try {
        if (!isAuthorized(tokenStore)) return res.render('login');
        if (isTokenExpired(tokenStore)) await refreshToken(hubspotClient,GRANT_TYPES,CLIENT_ID,CLIENT_SECRET,tokenStore);

        const properties = ['firstname', 'lastname', 'company'];

        // Get first contacts page
        // GET /crm/v3/objects/contacts
        // https://developers.hubspot.com/docs/api/crm/contacts
        console.log('Calling crm.contacts.basicApi.getPage. Retrieve contacts.');
        const contactsResponse = await hubspotClient.crm.contacts.basicApi.getPage(
        OBJECTS_LIMIT,
        undefined,
        properties
        );
        logResponse('Response from API', contactsResponse);

        res.render('contacts', {
        tokenStore,
        contacts: prepareContactsContent(contactsResponse.results),
        });
    } catch (e) {
        handleError(e, res);
    }
};

exports.getContact = async(req,res) => {
    try {
        const contactId = "galanghoingocanada@gmail.com";
        const properties = ["hs_object_id"];
        const associations = ["deals"];
        const archived = false;
        const id_property= 'email';
        console.log('Calling crm.contacts.basicApi.getPage. Retrieve contact.');
        const contactsResponse = await hubspotClient.crm.contacts.basicApi.getPage(
            contactId,
            properties,
            undefined,
            associations,
            archived,
            id_property
        );
        
        logResponse('Response from API', contactsResponse);

    }   catch      (e) {
        handleError(e, res);  
    }
}; 

exports.authorize = async (req, res) => {
    // Use the client to get authorization Url
    // https://www.npmjs.com/package/@hubspot/api-client#obtain-your-authorization-url
    console.log('Creating authorization Url');
    const authorizationUrl = hubspotClient.oauth.getAuthorizationUrl(
        CLIENT_ID,
        REDIRECT_URI,
        SCOPES
    );
    console.log('Authorization Url', authorizationUrl);

    res.redirect(authorizationUrl);
};

exports.getAccesstoken = async (req, res) => {
    const code = _.get(req, 'query.code');

    // Create OAuth 2.0 Access Token and Refresh Tokens
    // POST /oauth/v1/token
    // https://developers.hubspot.com/docs/api/working-with-oauth
    console.log('Retrieving access token by code:', code);
    const getTokensResponse = await hubspotClient.oauth.tokensApi.createToken(
        GRANT_TYPES.AUTHORIZATION_CODE,
        code,
        REDIRECT_URI,
        CLIENT_ID,
        CLIENT_SECRET
    );
    logResponse('Retrieving access token result:', getTokensResponse);

    tokenStore = getTokensResponse;
    tokenStore.updatedAt = Date.now();

    // Set token for the
    // https://www.npmjs.com/package/@hubspot/api-client
    hubspotClient.setAccessToken(tokenStore.accessToken);
    res.redirect('/');
};

exports.emptyTokenStore = () => {
    tokenStore = {};
};

exports.refreshAuthpage =  async (req, res) => {
    try {
        if (isAuthorized(tokenStore)) await refreshToken(hubspotClient,GRANT_TYPES,CLIENT_ID,CLIENT_SECRET,tokenStore);
        res.redirect('/');
    } catch (e) {
        handleError(e, res);
    }
};

setInterval(autoRefresh,5*60*1000);

function autoRefresh() {
    refreshToken(hubspotClient,GRANT_TYPES,CLIENT_ID,CLIENT_SECRET,tokenStore)
};