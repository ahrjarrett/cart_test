var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    engine = require('ejs-mate'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),

    port = 3000,
    User = require('./models/user');


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
app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(port, function(err) {
    if(err) throw err;
    console.log('Server is running on port ' + port);
});

