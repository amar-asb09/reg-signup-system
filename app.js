const express = require('express');
const path = require('path');
// calling mongoose after installing it and adding dependencies
const mongoose = require('mongoose');

//express-session
const session = require('express-session')

//express-validator
const expressValidator = require('express-validator')

//express-mesaages - connect-falsh
const flash = require('connect-flash');

//adding body parser to the app
const bodyparser = require('body-parser');


//bringinf passport
const passport = require('passport');


//adding databse config file
const databaseConfig = require('./config/database');

// connecting to mongoose databse
mongoose.connect(databaseConfig.database);


let db = mongoose.connection;
//check connection
db.once('open', () => {
    console.log('Connected to mongo DB');
});

//check for db errors
db.on('error', (err) => {
    console.log('err')

});

//app initialise
const app = express();

//adding Databse modal
let Article = require('./modals/article');

//adding body-parser middleware
app.use(bodyparser.urlencoded({
    extended: true
})); //parse application or form-urlencoded

// parse json
app.use(bodyparser.json())

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//public static folders
app.use(express.static(path.join(__dirname, 'public')));

//express-session Middleware 
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res); //messages is global variable for storing messages
    next();
});


//express-validator middleware

app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }

}));

//passport config
require('./config/passport')(passport);
 

//initialising passport - middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req,res,next)=>
{
    res.locals.user = req.user || null;
    next();
})

//home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});

let routeArticles = require('./routes/articles');
let routeUsers = require('./routes/users');
app.use('/articles', routeArticles);
app.use('/users', routeUsers);


//Server start
app.listen(3000, () => {
    console.log('Server Started on Port 3000.....')

});