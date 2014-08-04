var express = require('express');

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));