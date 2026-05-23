const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(PORT, () => {
    console.log(`Server active on port ${PORT}`);
});
