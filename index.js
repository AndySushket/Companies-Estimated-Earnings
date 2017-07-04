let express = require('express');
let bodyparser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

let app = express();

app.use(bodyparser.urlencoded({
	extended:true
}));
app.use(bodyparser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index')
});

app.post('/insertDB', function (request, response) {
	let item={$set:{companys:request.body}};
	MongoClient.connect("mongodb://admin:admin@ds143892.mlab.com:43892/companys",function(err,db){
		if(err){
			console.log(err,"lol!!");
		}else{
			console.log("connected");
			let collection = db.collection("companys");
			let cursor= collection.update({_id:  ObjectId("5958cc61376d5a1d482da9f0")},item,function (err,result) {
				if(err){
					console.log(err,"lol!!");
				}else {
					console.log("item inserted");
					let cursor= collection.find( { _id: ObjectId("5958cc61376d5a1d482da9f0") } );
					let result=[];
					cursor.forEach(function (doc,db) {
						result.push(doc);
					},function () {
						db.close();
						response.send(result);
					});
				}
			});
		}
	});
});

app.get('/getDB', function (request, response) {
	MongoClient.connect("mongodb://admin:admin@ds143892.mlab.com:43892/companys",function(err,db){
		if(err){
			console.log(err,"lol!!");
		}else{
			console.log("connected");
			let collection = db.collection("companys");
			let cursor= collection.find( { _id: ObjectId("5958cc61376d5a1d482da9f0") } );
			let result=[];
			cursor.forEach(function (doc,db) {
					result.push(doc);
			},function () {
				db.close();
				response.send(result);
			});
		}
	});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});