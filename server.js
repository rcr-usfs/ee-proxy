const cors = require('cors');
const ee = require('@google/earthengine');
const express = require('express');
const privateKey = require('./service-key.json');
const proxy = require('express-http-proxy');

const server = express();

server.use(cors());

server.use('/', proxy('earthengine.googleapis.com', {
    https: true,
    proxyReqOptDecorator: function (proxyRequestOptions, sourceRequest) {
        proxyRequestOptions.headers['authorization'] = ee.data.getAuthToken();
        return proxyRequestOptions;
    }
}));

ee.data.authenticateViaPrivateKey(privateKey,
    // on success authentication
    () => {
        console.log('Authentication with Google, starting server')
        const port = process.env.PORT || 8081
        server.listen(port, () => console.log(`Listening on ${port}`));
    },
    // on error authentication
    (error) => {
        console.log('Error authenticating with Google');
        console.log(error);
    }
);
