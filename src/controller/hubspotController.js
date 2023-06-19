const _ = require('lodash');
const { isAuthorized,isTokenExpired }            = require('../services/authService');
const { refreshToken,getToken,fetchPortalID,
        prepareContactsContent,readContacts,readContact,updateContact
        ,getDeal,writeImage,writeNote,searchDeals,
        logResponse,handleError,getAuthURL,setAccessToken }   = require('../services/hubspotService');

const { HUBSPOT,
        PASSWORD }    =  require('../model/config');
const   CLIENT_ID     = HUBSPOT.appId;
const   CLIENT_SECRET = HUBSPOT.secret;  


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
let accessToken;

exports.getContacts = async (req, res) => {
    try {
        if (!isAuthorized(tokenStore)) return res.render('login');
        if (isTokenExpired(tokenStore)) await refreshToken(tokenStore,accessToken);
        
        const contactsResponse = await readContacts();
        logResponse('Response from API', contactsResponse);

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
        const contactId = req.body.email;
        // console.log('Calling crm.contacts.basicApi.getById. Retrieve contact.');
        const contactsResponse = await readContact(contactId);

        logResponse('Response from API', contactsResponse);
        req.contact = contactsResponse ;
        next();

    }   catch      (e) {
        handleError(e, res);
    }
};

exports.getDeals = async (req,res) => {
    try {
        if(req.body.deals) {
            let deals = req.body.deals;
            for (let i=0; i<deals.length; i++) {
                deals[i] = await getDeal(deals[i].id);
            };
            req.body.deals = deals;
        } else {
            req.body.deals = [];
        }
        res.status(200).send(req.body);
    }   catch      (e) {
        handleError(e,res);
    }
};

setInterval(autoUpdateCredit,24*60*60*1000);

async function autoUpdateCredit () {
    try {
        console.log('Retrieving latest deals...');
        const response = await searchDeals();
        let   deals = response.results.map(deal => { return { id:deal.id } });
        if(deals.total > 0) {
            for (let i=0; i<deals.length; i++) {
                console.log('getting deal:',deals[i].id);
                deals[i] = await getDeal(deals[i].id);
                console.log('getting contact:',deals[i].id);
                const contact = await readContact({contactID:deals[i].contactID});
                deals[i].referred_by = contact.properties.referred_by.split('/').pop();
                if (deals[i].referred_by) {
                    const contact = await readContact({contactID:deals[i].referred_by});
                    deals[i].referrer_commission = contact.properties.commission;
                    deals[i].referral_credit     = contact.properties.referral_credit;
                    const rcdt = Number(deals[i].referral_credit);
                    const rcom = Number(deals[i].referrer_commission);
                    const prft = Number(deals[i].profit);
                    deals[i].referral_credit     = rcdt + prft * rcom;
                    deals[i].update              = await updateContact({
                        referral_credit:JSON.stringify(deals[i].referral_credit),
                        contactID:                     deals[i].referred_by
                    })
                }
            };
        }
        return deals;
    } catch (e) {
      debug (e)  
    }
};

exports.authorize = async (req, res) => {
    try {
        console.log('authorize password:',req.body);
        if (req.body.password === PASSWORD) {
            // Use the client to get authorization Url
            // https://www.npmjs.com/package/@hubspot/api-client#obtain-your-authorization-url
            console.log('Creating authorization Url');
            const authorizationUrl = await getAuthURL();
            console.log('Authorization Url', authorizationUrl);
            res.redirect(authorizationUrl);
        } else {
            const err        = new Error('Password is incorrect');
                  err.status = 401;
            throw err; 
        }
    }   catch      (e) {
        handleError(e, res);
    }
};

exports.getAccesstoken = async (req, res, next) => {
    const code = _.get(req, 'query.code');

    // Create OAuth 2.0 Access Token and Refresh Tokens
    // POST /oauth/v1/token
    // https://developers.hubspot.com/docs/api/working-with-oauth
    console.log('Retrieving access token by code:', code);
    const getTokensResponse = await getToken(code);
    logResponse('Retrieving access token result:', getTokensResponse);

    tokenStore = getTokensResponse;
    tokenStore.updatedAt = Date.now();
    accessToken = getTokensResponse.accessToken

    // Set token for the
    // https://www.npmjs.com/package/@hubspot/api-client
    setAccessToken(tokenStore.accessToken);
    res.redirect('/activation');
};

exports.emptyTokenStore = () => {
    tokenStore = {};
    accessToken = null;
};

exports.refreshAuthpage =  async (req, res) => {
    try {
        if (isAuthorized(tokenStore)) await refreshToken(tokenStore,accessToken);
        res.redirect('/activation');
    } catch (e) {
        handleError(e, res);
    }
};

setInterval(autoRefresh,25*60*1000);

function autoRefresh() {
    refreshToken(tokenStore,accessToken)
};

const formidable = require('formidable');
const debug      = require('debug')('file_upload:index');
const Hubspot    = require('hubspot');

exports.uploadImage = async (req, res, next) => {
    try {
        console.log('uploadImage req.body',req.body);
        console.log('uploadImage req.data',req.data);
        let hubspot = new Hubspot({ accessToken: accessToken })
        if(!req.body.contactID) {
        new formidable.IncomingForm().parse(req, async (err, fields, files) => {
            console.log('err',err);
            console.log('fields',fields);
            console.log('files',files);
            console.log('uploading image...2');
            if (err) throw err;
    
            const { contactID }   = fields;
            const   fileName      = `${contactID}`;
            console.log('uploadImage fileName',fileName);
            const uploadingResult = await writeImage({hubspot,fileName,files:files.content._writeStream});
            const photoID         = uploadingResult.objects[0].id;
            console.log('uploadImage photoID',photoID);
            req.body = { photoID,contactID };
            console.log('uploadImage req.body',req.body);
            res.sendStatus(200);
        }); 
        } else {
            const { contactID } = req.body;
            const   fileName    = `${contactID}`;
            console.log('uploadImage fileName:',fileName);
            const uploadingResult = await writeImage({hubspot,fileName});
            const photoID         = uploadingResult.objects[0].id;
            console.log('uploadImage photoID:',photoID);
            req.body.photoID = photoID;
            console.log('uploadImage req.body:',req.body);
            next();
        }  
    }   catch (e) {
        debug (e)
    }
};

exports.photoNote = async (req,res,next) => {
    try {
        let hubspot = new Hubspot({ accessToken: accessToken });
        const { photoID,contactID } = req.body;
        const photoNoteResponse = await writeNote({hubspot,photoID,contactID})
        console.log('photoNote:',photoNoteResponse.metadata);
        next();
      } catch (e) {
        debug (e)
      }
};

exports.referrerNote = async (req,res) => {
    try {
        let hubspot = new Hubspot({ accessToken: accessToken });
        const { portalID,contactID,referred_by } = req.body;
        if (referred_by) {
            console.log('referrerNote req.body:',req.body);
            const referrerNoteResponse = await writeNote({hubspot,portalID,contactID,referred_by})
            console.log('referrerNoteResponse:',referrerNoteResponse.metadata);
        }
        res.status(201).send(req.body);
    } catch (e) {
      debug (e)
    }
};

exports.getPortalID = async(req,res,next) => {
    try {
        console.log('Retrieving access portal id...');
        let hubspot = new Hubspot({ accessToken: accessToken })
        const response = await fetchPortalID(hubspot,accessToken);
        req.body.portalID = response;
        console.log("portalId:",req.body.portalID);
        next();
    } catch (e) {
      debug (e) 
    }
};
