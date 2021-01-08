const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan') ;
const mongoose = require('mongoose') ;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session) ;
const bodyParser = require('body-parser');
const multer = require('multer') ;

const port = 3000 ;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const locationRouter = require('./routes/location');
const adminRouter = require('./routes/admin');
const methodOverride = require('method-override');

const app = express();
const {password} = require("./data.js") ;
const {username} = require("./data.js") ;

const connection = 'mongodb+srv://' + username + ":" + password + "@cluster0.kvdiq.azure.mongodb.net/projet6?retryWrites=true&w=majority" ;

mongoose.connect(connection,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log(error));
    mongoose.set('useCreateIndex', true) ;

app.use(session({
    key: 'session_cookie_name',
    secret: 'keyboard cat',
    store: MongoStore,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/location', locationRouter);
app.use('/admin', adminRouter);
app.use(express.static('public/images'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
