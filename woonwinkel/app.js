var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var homeRouter = require('./routes/home');
// var contactRouter = require('./routes/contact');

var app = express();
const PORT = 3000;
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'woonwinkel'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

connection.query('SELECT * FROM products', (err, results) => {
  if (err) {
    console.error('Error fetching products:', err);
  } else {
    console.log('Products:', results);
  }
});

connection.end();


app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));

// view engine setup
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
// app.use('/users', contactRouter);

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

app.get('/pages/contact', (req, res) => {
  res.render('contact');
});

app.post('/pages/contact', (req, res) => {
  const { name, email, message } = req.body;
  res.render('contact-result', { name, email, message });
});

app.get('/search', function(req, res) {
  const searchTerm = req.query.search;

  connection.query('SELECT * FROM products WHERE name LIKE ?', ['%' + searchTerm + '%'], function(err, results) {
    if (err) throw err;

    res.render('search', { products: results });
  });
});