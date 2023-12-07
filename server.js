const https = require('https');
const httpProxy = require('http-proxy');
const fs = require('fs');
const url = require('url');

// Fetching values from environment variables or providing defaults
const targetURL = process.env.TARGET_URL;
const keyFilePath = process.env.KEY_FILE_PATH || 'valid-ssl-key.pem';
const certFilePath = process.env.CERT_FILE_PATH || 'valid-ssl-cert.pem';

const credentials = {
    key: fs.readFileSync(keyFilePath, 'utf8'),
    cert: fs.readFileSync(certFilePath, 'utf8')
};

const proxy = httpProxy.createProxyServer({
    ssl: credentials,
    secure: true
});

const httpsServer = https.createServer(credentials, function(req, res) {
    console.log('Request', req.method, req.url);

    const parsedUrl = url.parse(req.url);
    const pathWithQuery = parsedUrl.path; // Includes path and query parameters

    const targetWithParams = targetURL + pathWithQuery;

    const headers = Object.assign({}, req.headers, {
        'X-Original-URL': targetWithParams
    });

    proxy.web(req, res, { target: targetURL, headers: headers }, function(e) {
        console.log(e);
    });
});

const PORT = process.env.PORT || 3000;

httpsServer.listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
});


