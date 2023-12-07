const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');

// Fetching values from environment variables or providing defaults
const targetURL = process.env.TARGET_URL || "https://script.google.com/macros/s/AKfycbyIvgq7xgFFY-6l2qE9dLrTZdByG6fnFzsHOSxQhrJyht21PsgE5nWOmt_jnHgVro9_/exec";

const proxy = httpProxy.createProxyServer({
    secure: true
});

const httpServer = http.createServer(function(req, res) {
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

httpServer.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
});


