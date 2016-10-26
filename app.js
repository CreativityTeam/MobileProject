var express = require('express');
var app = express();
var port = process.env.port || 3000;
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var LocalStratery = require('passport-local').Stratery;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var expressvalidator = require('express-validator');
var flash = require('connect-flash');
var cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mobile',function(err){
    if(err) throw ('Please check your connection');
    console.log('Connect Successfully');
});

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();    
});
/**Body parser */
//* Its purpose to get value from client
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
/**Express session(Just define to user after)*/
app.use(session({
   secret: 'secret',
   saveUninitialized : true,
   resave : true
}));
/**Express validator */
//* Its purpose to validate the information of client
app.use(expressvalidator({
    errorFormatter: function(param,msg,value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

    while(namespace.length){
        formParam += '[' + namespace.shift() + ']';
    }
    return{
        param: formParam,
        msg : msg,
        value : value
        };
    }
}));

/**Passport */
//* Its purpose to authenticate the user information
app.use(passport.initialize());
app.use(passport.session());

/**Connect Flash */
app.use(flash());

/**Global Varable */
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

/**Route for model */
//* Its purpose to call api
var users = require('./routes/users');
var restaurants = require('./routes/restaurants');
var ratings = require('./routes/ratings');
var photos = require('./routes/photos');

/**URL for model */
//* Its purpose to call the right api for model
app.use('/api/users',users);
app.use('/api/restaurants',restaurants);
app.use('/api/ratings',ratings);
app.use('/api/photos',photos);

/**Set up Server */
app.listen(port,function(){
    console.log("Server is running at :" + port);
})