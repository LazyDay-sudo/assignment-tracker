const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

// Handle the custom web routing proxy path
app.use('/route', (req, res, next) => {
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

// CRITICAL: Export the app module for Vercel Serverless Function architecture
module.exports = app;
