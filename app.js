const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const hbs = require('express-handlebars')
const session = require('express-session');
const multer = require('multer')
const cors = require('cors')

const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
mongoose.connect('mongodb+srv://safwanAshraf:basith123@cluster0.fnqmdew.mongodb.net/BeSmart?retryWrites=true&w=majority').then(()=>{
  console.log("datbase Connected")
})
const app = express();
const count = 182 * 24 * 60 * 60 * 1000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',
defaultLayout:'layout',
layoutsDir:__dirname+'/views/',
partialsDir:__dirname+'/views/partials/',
helpers:{
  formatString(date){
    newdate = date.toUTCString()
    return newdate.slice(0 , 16)
  },
inc1: function (context){
  return context +1
},

subTotal:function (price,quantity){
  console.log('sdlkfjsldkfjlsdk',price, quantity)
    return price*quantity
}
}
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "Key",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: count }
}));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use(cors())


app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('users/error');
});


module.exports = app;

