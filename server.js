var express = require('express');
var url = require('url');
var mongoose = require('mongoose');
var cities = require('./cities.js');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*var cities = [
	{city: 'Provo'},
	{city: 'Panguitch'},
	{city: 'Paris'}
];*/

var jsonresult = [];

app.get('/getcities', function(req, res) {
	var query = url.parse(req.url, true).query.q;
	if (query == void 0) {
		res.send([]);
		return;
	}
	var regEx = new RegExp("^"+query+".*$");
	res.send(cities.filter(function(value) {
		jsonresult = regEx.test(value);
		return jsonresult;
	}));

	//console.log(JSON.stringify(jsonresult));
	//res.writeHead(200);
	//res.end(JSON.stringify(jsonresult));
});

app.get('/multiply', function(req, res) {
	var a = url.parse(req.url, true).query.a;
	var b = url.parse(req.url, true).query.b;
	if (a === void 0 || b === void 0) {
		res.send([]);
		return;
	}
	var result = parseInt(a)*parseInt(b);
	res.send("The result of your query was: "+result.toString());
});

mongoose.connect("mongodb://localhost:27017/comments"); //

var Schema = mongoose.Schema;

var commentSchema = new Schema({
	Name: String,
	Rating: String,
	Comment: String
});

var Comment = mongoose.model('Comment', commentSchema);

app.post('/comment', jsonParser, function(req, res) {
	console.log("POST comment route");
      var jsonData = "";
      req.on('data', function (chunk) {
        jsonData += chunk;
      });
      req.on('end', function () {
        var reqObj = JSON.parse(jsonData);
        console.log(reqObj);
        console.log("Name: "+reqObj.Name);
        console.log("Comment: "+reqObj.Comment);
         // Now put it into the database
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect("mongodb://localhost:27017/comments", function(err, db) {
          if(err) throw err;
          db.collection('comments').insert(reqObj,function(err, records) {
            //console.log("Record added as "+records[0]._id);
          });
        });
      });

      /*var comment = new Comment(req.body);
      comment.save(function(err) {
      	if (err) throw err;
      	console.log("YEAH!");
      	res.send('Success');
      });*/
});

app.get('/comments', function(req, res) {
	Comment.find({}, function(err, comments) {
		if (err) throw err;
		res.send(comments);
	});
});

app.use(express.static('public'));

app.listen(3006);

