require('dotenv').config();
let jsSHA = require('jssha');
let btoa  = require('btoa');

let applicationId = process.env.appId;
let developerKey  = process.env.devId;

let getRandInt = () => {
    return Math.floor(Math.random() * Math.floor(9999));
}

function generateToken(expiresInSeconds){
    let EPOCH_SECONDS = 62167219200;
    let expires = Math.floor(Date.now()/ 1000) + expiresInSeconds + EPOCH_SECONDS;
    
    let shaObj = new jsSHA("SHA-384", "TEXT");
    shaObj.setHMACKey(developerKey, "TEXT");
    jid = "demoUser" + getRandInt() + '@' + applicationId;

    let body = 'provision' + '\x00' + jid + '\x00' + expires + '\x00';
    shaObj.update(body);

    let mac = shaObj.getHMAC("HEX");
    let serialized = body + '\0' + mac;
    return btoa(serialized);
}


module.exports = {generateToken}