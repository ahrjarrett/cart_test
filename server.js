var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),

    port = 3000,
    User = require('./models/user');

var app = express();

mongoose.connect('mongodb://root:Swear!23@ds041556.mlab.com:41556/cart_test', function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/create-user', function(req, res, next) {
    var user = new User();

    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;

    user.save(function(err) {
        if (err) return next(err);
        res.json('Successfully created a new user: ' + user.profile.name);
    });
});

app.listen(port, function(err) {
    if(err) throw err;
    console.log('Server is running on port ' + port);
});

