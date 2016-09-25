var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    port = 3000;

// mongoLab user and password below
mongoose.connect('mongodb://root:Swear!23@ds041556.mlab.com:41556/cart_test', function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

app.use(morgan('dev'));

app.get('/', function(req, res){
    res.json('json response from server.js');
});

app.listen(port, function(err) {
    if(err) throw err;
    console.log('Server is running on port ' + port);
});

