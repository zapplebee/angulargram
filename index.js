var instagramFeed = require('./instagramFeed.js');
var express = require('express');
var app = express();

app.get('/instagram.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  instagramFeed(64,function(e){res.send(e);});
});

app.use(express.static('static'));

app.listen(3000, function () {
  console.log('Listening on port 3000');
});