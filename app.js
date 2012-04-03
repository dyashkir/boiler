
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


//connect to stuff
var port = process.env.PORT;
var redis;

if (process.env.REDISTOGO_URL) {
  //connecting to heroku redisToGo instance
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  redis = require('redis').createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(':')[1]);

}else{
  redis = require('redis').createClient();
}

//postgre
var pg = require('pg');
var pgClient;
var conString = 'tcp://@localhost/boiler';

//error handling omitted
pg.connect(conString, function(err, client) {
  if (!err){
    console.log('Connected to postgre');
    pgClient = client;
  }else{
    console.log('could not connect to postgre ');
    console.dir(err);
  }
});

// Routes

app.get('/', function(req, res){
  res.send(404);
});

app.get('/ameals', function(req, res) {
  var availableMeals = [
        { mealName: "Standard (sandwich)", price: 0 },
        { mealName: "Premium (lobster)", price: 34.95 },
        { mealName: "Ultimate (whole zebra)", price: 290 }
    ];    
  res.send(JSON.stringify(availableMeals));
});

app.post('/reserve', function(req, res) {
  var stuff = req.body;
  console.log(JSON.stringify(stuff));
  res.end();
});


if (!module.parent) {
  app.listen(port);
  console.log("Express server listening on port %d", app.address().port);
}
