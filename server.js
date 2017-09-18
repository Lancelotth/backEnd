const express = require('express');
const bodyParser= require('body-parser');
const app = express();
var _dirname = 'C:/Users/1413424/Desktop/backEnd';
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs')
var db;

MongoClient.connect('mongodb://localhost:27017/mydb',(err,database) =>{
	if(err){ 
		var ce = console.log(err);
		return ce;
	}
	db= database;
	app.listen(3000, () => {
  		console.log('listening on 3000');
	});
});

	app.use(
		bodyParser.urlencoded({
			extended: true
		})
	);
	
	app.get('/', (request, response) => {
		var cursor = db.collection('qutes').find({}).toArray(function(err,results){
			if (err) {console.log(err);}
			console.log('get');
			response.render('index.ejs', {citas: results});
			//response.sendFile(_dirname + '/index.html');
		});

	});
	
	app.get('/delete',(request,response)=>{
		db.collection('qutes').remove({});
		response.redirect('/');
	});

	app.post('/register', (request, response) => {
		db.collection('qutes').save(request.body,(err,result)=>{
			if (err) {console.log(err); }
			console.log('saved to database');
			response.redirect('/');
		});
	});


	app.get('/register', (request, response) => {
			response.render('register.ejs');
	});

	
	