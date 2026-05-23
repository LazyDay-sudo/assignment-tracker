const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

app.use('/api', (req, res, next) => {
    // In Vercel, the path comes after /route/
    const targetUrl = req.url.substring(1); 
    if (!targetUrl) return res.status(400).send('No target URL provided.');

    proxy(targetUrl, {
        proxyReqOptDecorator: (proxyReqOpts) => {
            proxyReqOpts.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
            return proxyReqOpts;
        },
        userResHeaderDecorator: (headers) => {
            delete headers['x-frame-options'];
            delete headers['content-security-policy'];
            return headers;
        }
    })(req, res, next);
});

module.exports = app;
