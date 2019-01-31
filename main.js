var express = require('express');
var http = require('http');
var path = require('path');
var app = require('express')();
var server = require('http').Server(app); 
app.set('port', 8085);
app.use('/static', express.static(__dirname + '/static'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/main.html'));
});
server.listen(8085, function() {
    console.log('Starting server on port 8085');
});
