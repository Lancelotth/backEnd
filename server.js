// Set up ================================================================================================================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             			// log requests to the console (express4)
var bodyParser = require('body-parser');    			// pull information from HTML POST (express4)
var methodOverride = require('method-override'); 		// simulate DELETE and PUT (express4)
var port = process.env.PORT || 3000;

//configuration ==========================================================================================================

mongoose.connect('mongodb://localhost:27017/mydb'); 

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model ==========================================================================================================

var Todo = mongoose.model('Todo', {
    text : String,
    done : Boolean
});

// listen (start app with node server.js) ================================================================================

var db= mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
	app.listen(port,(err, result)=>{
		if (err) {
			console.log(err)
		}else{
			console.log('listening on: ' + port)
		}
	});
});

// routes ================================================================================================================

    // api ---------------------------------------------------------------------
    // get all todos
	
	app.get('/api/todos', function(req, res) {
        var cursor = db.collection('qutes').find({}).toArray((err,result)=>{
			if (err) {console.log(err);}
			console.log('get' + result);
			//response.render('index.ejs', {citas: result});
			//response.sendFile(_dirname + '/index.html');
			//response.send(result);
   		 });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {
       db.collection('qutes').save(request.body,(err,result)=>{
			if (err) {console.log(err); }
			console.log('saved to database');
			response.send(result);
		});
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        db.collection('qutes').findOneAndDelete({First_Name: request.body.First_Name},(err,result)=>{
			if(err){
				console.log(err);

			}else{
				console.log(result);
				response.redirect('/');
			}
		});
		console.log('deleted from database ' + request.body.First_Name);
    });

    // application -------------------------------------------------------------
    app.get('*', (req, res) => {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });