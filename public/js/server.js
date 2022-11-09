const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// const client = require('') // DB
app.set('view engine', 'ejs');

app.listen(8080, function () {
    console.log('listening on port 8080');
});

// main page
app.get('/', (req, res) =>{
    try {
        // res.sendFile('index.ejs', {root: 'views'});
        res.render('index');
    } catch (err) {
        console.error(err);
    }
})

app.get('/consulting', (req, res) =>{
    res.render('consulting.ejs');
})

