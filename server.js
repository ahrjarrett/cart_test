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
    MongoStore = require('connect-mongo/es5')(session),
    passport = require('passport'),

    secret = require('./config/secret'),
    Category = require('./models/category'),
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
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(function(req, res, next) {
    Category.find({}, function(err, categories) {
        if (err) return next(err);
        res.locals.categories = categories;
        next();
    })
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);

app.listen(secret.port, function(err) {
    if(err) throw err;
    console.log('Server is running on port ' + secret.port);
});

