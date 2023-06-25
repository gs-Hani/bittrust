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
    },
    
    DB: {
        user    : process.env.DB_USER,
        host    : process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        dbport  : process.env.DB_PORT
    }
}
