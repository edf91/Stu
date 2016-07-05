var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var path = require('path');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000;
var app = express();
var dburl = 'mongodb://localhost/movie';
mongoose.connect(dburl);


app.set('views','./app/views/pages');
app.set('view engine','jade');
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ 'extended': true }));
// session
app.use(cookieParser());
app.use(session({
	secret : 'movie',
	store : new mongoStore({
		url : dburl,
		collection: 'sessions'
	})
}));

if('development' === app.get('env')){
	app.set('showStackError',true);
	app.use(morgan('dev'));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

require('./config/routes')(app);

app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment');
app.listen(port);



console.log('movie start on port : ' + port);