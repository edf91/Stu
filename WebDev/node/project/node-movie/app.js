var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/movie');

app.set('views','./views/pages');
app.set('view engine','jade');
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ 'extended': true }));

app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment');
app.listen(port);

app.get('/',function(req,res){
	Movie.fetch(function(error,movies){
		if(error) console.error(error);

		res.render('index',{
			title:'movie 首页',
			movies: movies
		});	
	});
	/*res.render('index',{
		title:'movie 首页',
		movies: [{
			title: 'X战警',
			_id: 1,
			poster: 'http://img3.imgtn.bdimg.com/it/u=2653308224,1709863547&fm=11&gp=0.jpg'
		},{
			title: 'X战警2',
			_id: 2,
			poster: 'http://img3.imgtn.bdimg.com/it/u=2653308224,1709863547&fm=11&gp=0.jpg'
		}]
	});*/
});
app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	Movie.findById(id,function(error,movie){
		res.render('detail',{
			title: '详情',
			movie: movie
		});
	});
	/*res.render('detail',{
		title: '详情',
		movie: {
			doctor: 'wxd',
			country: 'CH',
			title: 'X战警',
			year: '2014'
		}
	});*/
});
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title: '后台录入',
		movie: {

		}
	});
});

app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(error,movie){
			res.render('admin',{
				title : '后台更新',
				movie: movie
			});
		});
	}
});

app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if(id != undefined){
	 	Movie.findById(id,function(error,movie){
	 		if(error)console.error(error);
	 		_movie = _.extend(movie,movieObj);
	 		_movie.save(function(error,movie){
	 			if(error) console.error(error);
	 			res.redirect('/movie/' + movie._id);
	 		});
	 	});
	}else{
	 	_movie = new Movie({
	 		doctor : movieObj.doctor,
	 		title : movieObj.title,
	 		country : movieObj.country,
	 		language : movieObj.language,
	 		year: movieObj.year,
	 		poster : movieObj.poster,
	 		summary : movieObj.summary,
	 		flash : movieObj.flash
	 	});
	 	_movie.save(function(error,movie){
	 		if(error) console.error(error);
	 		res.redirect('/movie/' + movie._id);
	 	});
	 }
});

app.get('/admin/list',function(req,res){

	Movie.fetch(function(error,movies){
		if(error) console.error(error);

		res.render('list',{
			title:'movie 列表',
			movies: movies
		});	
	});

	/*
	res.render('list',{
		title: 'movie list',
		movies: [{
			title: 'X战警',
			_id: 1
		}]
	});*/
});


app.delete('/admin/list',function(req,res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id:id},function(error,movie){
			if(error) console.error(error);
			else{
				res.json({success : 1});
			}
		});
	}

});


console.log('movie start on port : ' + port);