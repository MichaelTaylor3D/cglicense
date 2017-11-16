var express = require('express');  
var request = require('request');
var app = express();  
const opn = require('opn')

app.use('/vlc', function(req, res) { 
 var url = 'http://127.0.0.1:30304' + req.url;
 req.pipe(request(url)).pipe(res);
});

app.use(express.static(__dirname))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

console.log('Open up http://127.0.0.1:3000 to view app');
app.listen(3000);
opn('http://127.0.0.1:3000');
