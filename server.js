var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    engine = require('ejs-mate'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    flash = require('express-flash'),
    MongoStore = require('connect-mongo')(session),
    passport = require('passport'),

    secret = require('./config/secret'),
    User = require('./models/user');


mongoose.connect(secret.database, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});


app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.database, autoReconnect: true })
}));
app.use(flash());


app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(secret.port, function(err) {
    if(err) throw err;
    console.log('Server is running on port ' + secret.port);
});

