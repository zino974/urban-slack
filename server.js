// add http module and client
var http = require('http');
var express = require('express');
var request = require('request');
var settings = require('./settings');
var ua = require('universal-analytics');
var bodyParser = require('body-parser');
var callback = require('./callback');

//let the server port be configurable. it really doesn't matter since this
//is a listening port. Moubot v1 does not listen.
var PORT = settings.serverPort;

//initialize Google Analytics
var visitor = ua(settings.GA);

//initiate the express web app
var app = express();
app.use(express.static(__dirname + '/web'));
app.use(ua.middleware(settings.GA));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//api call that returns the infomation about the next match. this needs to
//be tidyed up.
app.post('/api', function(req, res){
  //google pageview tracking
  visitor.pageview("/api").send();
  res.send('Api request received...');

  //capture request details and prepare for Urban API request
  var response_url = req.body.response_url;
  var req_text = req.body.text;
  var urban_request = settings.urbanAPI + req_text;

  //set urban api url;
  var options = {
    url: urban_request
  };
  //hit up urban dictionary API
  request(options,callback.callback);
});


//start the server and listen on the designated port
var server = app.listen(process.env.PORT || PORT, function(){
  console.log("Server started at localhost:%s", PORT);
});