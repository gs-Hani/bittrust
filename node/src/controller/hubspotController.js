const _ = require('lodash');
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client();
const { isAuthorized,isTokenExpired }            = require('../services/authService');
const { refreshToken,prepareContactsContent,
        logResponse,handleError,fileToBuffer }   = require('../services/hubspotService');

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

let tokenStore = {};
let accessToken

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
        // console.log('Calling crm.contacts.basicApi.getPage. Retrieve contacts.');
        const contactsResponse = await hubspotClient.crm.contacts.basicApi.getPage(
        OBJECTS_LIMIT,
        undefined,
        properties
        );
        // logResponse('Response from API', contactsResponse);

        res.render('contacts', {
        tokenStore,
        contacts: prepareContactsContent(contactsResponse.results),
        });
    } catch (e) {
        handleError(e, res);
    }
};

exports.getContact = async(req,res,next) => {
    try {
        const contactId = req.body.username;
        const properties = ["hs_object_id"];
        const associations = ["deals"];
        const archived = false;
        const id_property= 'email';
        // console.log('Calling crm.contacts.basicApi.getById. Retrieve contact.');
        const contactsResponse = await hubspotClient.crm.contacts.basicApi.getById(
            contactId,
            properties,
            undefined,
            associations,
            archived,
            id_property
        );

        logResponse('Response from API', contactsResponse);
        req.contact = contactsResponse ;
        next();

    }   catch      (e) {
        handleError(e, res);  
    }
};

const getDeal = async (id) => {
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

exports.getDeals = async (req,res) => {
    try {
        let deals = req.contact.associations.deals.results;
        for (let i=0; i<deals.length; i++) {
            deals[i] = await getDeal(deals[i].id);
        }
        res.status(200).send(deals);
    }   catch      (e) {
        handleError(e,res);
    }
}

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
    accessToken = getTokensResponse.accessToken

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

setInterval(autoRefresh,25*60*1000);

function autoRefresh() {
    refreshToken(hubspotClient,GRANT_TYPES,CLIENT_ID,CLIENT_SECRET,tokenStore)
};

const formidable = require('formidable');
const debug      = require('debug')('file_upload:index');
const Hubspot    = require('hubspot');

exports.uploadImage = async (req, res, next) => {
    try {
        let hubspot = new Hubspot({ accessToken: accessToken })
        new formidable.IncomingForm().parse(req, async (err, fields, files) => {

            if (err) throw err;

            const { contactID } = fields;
            const fileName      = `${contactID}`;
            const folderPath    = 'IDs';
            const content       = await fileToBuffer(files.content._writeStream);
            const option        = {
                access: 'PUBLIC_NOT_INDEXABLE',
                overwrite: true,
                duplicateValidationStrategy: 'NONE',
                duplicateValidationScope:'EXACT_FOLDER'
            };

            const uploadingResult = await hubspot.files.upload({ content,fileName,folderPath,options:option});
            const photoID         = uploadingResult.objects[0].id;

            req.body.photoID = photoID;
            req.body.contactID = contactID;

            next();

        });
    }   catch (e) {
        debug (e)
    }
};

exports.createNote = async (req,res) => {
    try {
        let hubspot = new Hubspot({ accessToken: accessToken });
        const { photoID,contactID } = req.body;
        const   noteEngagement = {
            engagement  : { active: true, type: "NOTE" },
            associations: { contactIds: [contactID] },
            metadata    : { body: 'Attaching file to Deal.'},
            attachments : [ { id:photoID } ],
            json: true
        };
        const apiResponse = await hubspot.engagements.create(noteEngagement);
        console.log(apiResponse);
        res.status(201).send(apiResponse);
      } catch (e) {
        debug (e)
      }
}