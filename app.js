var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

const { default: mongoose } = require('mongoose');

var app = express();
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000','http://localhost:3001', 'http://127.0.0.1:3001'],
}

mongoose.connect(process.env.MONGODB_ATLAS_CLOUD_URI)
.then(() => {console.log("logged to DB")}).catch((err) => {console.log(`faild to connect to DB: ${err}`)});
app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth/register', require('./routes/register'));
app.use('/api/auth/login', require('./routes/login'));
app.use('/api/auth/logout', require('./routes/logout'));
app.use('/api/balance', require('./routes/balance'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/auth/confirmation', require('./routes/confirmation'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
