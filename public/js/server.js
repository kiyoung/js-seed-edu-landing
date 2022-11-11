// const http = require("http")
// const https = require("https")
// const fs = require("fs")
//
// var privateKey = fs.readFileSync("/etc/letsencrypt/live/seedconsulting.co.kr/privkey.pem")
// var certificate = fs.readFileSync("/etc/letsencrypt/live/seedconsulting.co.kr/cert.pem")
// var ca = fs.readFileSync("/etc/letsencrypt/live/seedconsulting.co.kr/chain.pem")
// const credentials = { key: privateKey, cert: certificate, ca: ca }

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// const client = require('') // DB
app.set('view engine', 'ejs');

app.listen(80, function () {
    console.log('listening on port 80');
});

// http.createServer(app).listen(80)
// https.createServer(credentials, app).listen(443)

// main page
app.get('/', (req, res) =>{
        res.render('index');
})

app.get('/consulting', (req, res) =>{
    res.render('consulting');
})

app.get('/reference_table', (req, res) =>{
    res.render('reference_table');
})

app.get('/test', (req, res) =>{
    res.render('test');
})

