var express = require('express');
require('express-resource');

var app = module.exports = express.createServer();

var resque = require('coffee-resque').connect({
  host: 'angler.redistogo.com',
  port: 9508,
  password: 'xxx'
});

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var port = process.env.PORT || 3001;
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);  
});


//////////////// Actions
app.post('/', function(req, res)  {
  resque.enqueue('node_jobs', 'add', JSON.stringify(req.headers));
  res.header('Status', 204);
  res.send();
});
