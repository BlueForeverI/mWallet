var express = require("express");
var parser = require("body-parser");
var cfenv = require('cfenv');

var app = express();
app.use(parser.json());

var appEnv = cfenv.getAppEnv();
var cfenv = require('cfenv');

app.get("/api", function(request, response){
   response.end("Hello world!"); 
});

app.listen(appEnv.port, function(){
    
});