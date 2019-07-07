"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var express = require("express");
const proxy = require('express-http-proxy');
var path = require("path");
var app = express();
const config = require('./../config');
const port = config.webport;
app.use('/', express.static(path.join(__dirname, '..', 'dist/ngzorropc')));
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get('/api/products',function(req,res){
    res.json({status:'OK',openurl:config.api+''});
})
app.get('/api/make',function(req,res){
  res.json({status:'OK',openif:false});
})
app.use('/bbm', proxy(config.api, {
    proxyReqPathResolver: function (req, res) {
      console.log(req.url);
      return require('url').parse("" + req.url).path;
    }
}));
var webServer = http.createServer(app).listen(port);
webServer.listen(port, function () {
  console.log('listening on http://localhost:' + port);
});

//var server = app.listen(4100, '192.168.42.227', function () {
//    console.log('localhost:4100');
//});
