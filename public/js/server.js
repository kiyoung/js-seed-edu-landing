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
