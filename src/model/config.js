require('dotenv').config({ path: '.env' });

module.exports = {
    PORT:     process.env.PORT,

    SECRET:   process.env.SECRET,
    
    NODE_ENV: process.env.NODE_ENV,

    PASSWORD: process.env.PASSWORD,

    HUBSPOT: {
        appId      : process.env.HUBSPOT_CLIENT_ID,
        secret     : process.env.HUBSPOT_CLIENT_SECRET,
        callbackUrl: process.env.HUBSPOT_CALLBACK_URL,
        scopes     : process.env.SCOPE
    }
}
