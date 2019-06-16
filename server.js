var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();
var mysql = require ('mysql');
var bodyParser = require('body-parser');
var upload = require('express-fileupload');
app.use(upload());
var urlecodedParser = bodyParser.urlencoded({extended:false});

var a;

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.get('/admin', function(req, res){
	var connection = mysql.createConnection({
		host: "MyHost",
		user: "User",
		password: "MyPass",
		database: "MyDb"
	});
	connection.connect();
	connection.query("SELECT COUNT(id) as count FROM news", function(error, results, fields){
	if (error) throw error;
		res.render('admin', {count: results[0].count});
	});
	connection.end();
});
app.get('', function(req, res){
	var connection = mysql.createConnection({
		host: "MyHost",
		user: "User",
		password: "MyPass",
		database: "MyDb"
	});
	connection.connect();
	var i;
	var obj = {
		id: [],
		jpg: [],
		docx: [],
		xlsx: [],
		zip: [],
		rar: [],
		text: []
	};
	connection.query("SELECT * FROM news DESK LIMIT 7", function(error, results, fields){
	if (error) throw error;
	for (i=0; i<results.length; i++){
		obj.id[i] = results[i].id;
		obj.jpg[i] = results[i].jpg;
		obj.docx[i] = results[i].docx;
		obj.xlsx[i] = results[i].xlsx;
		obj.zip[i] = results[i].zip;
		obj.rar[i] = results[i].rar;
		obj.text[i] = fs.readFileSync('public/text/'+(obj.id[i])+'.txt', 'utf8');
		if (obj.jpg[i] === 'null') obj.jpg[i] = 'null.jpg';
		if (obj.docx[i] === 'null') obj.docx[i] = 'null.docx';
		if (obj.xlsx[i] ==='null') obj.xlsx[i] = 'null.xlsx';
		if (obj.zip[i] === 'null') obj.zip[i] = 'null.zip';
		if (obj.rar[i] === 'null') obj.rar[i] = 'null.rar';
	}
	obj.id.reverse();
	obj.jpg.reverse();
	obj.docx.reverse();
	obj.xlsx.reverse();
	obj.zip.reverse();
	obj.rar.reverse();
	obj.text.reverse();		
	for (i=obj.id.length; i<7; i++){
		obj.id[i] = 'null';
		obj.jpg[i] = 'null';
		obj.docx[i] = 'null';
		obj.xlsx[i] = 'null';
		obj.zip[i] = 'null';
		obj.rar[i] = 'null';
		obj.text[i] = 'null';
	}
	res.render('index', {id: obj.id, jpg: obj.jpg, docx: obj.docx, xlsx: obj.xlsx, zip: obj.zip, rar: obj.rar, text: obj.text});
	});
	connection.end();	
});
app.get('*', function(req, res){
	res.render('404');
});
app.post('/admin', urlecodedParser,function(req, res, next) {
	if (req.body.firstname != 'Заголовок новости' || req.body.lastname != 'Текст новости'){
		if (req.files){
			var fjpg = req.files.fjpg;
			if (fjpg == undefined) fjpg = 'null';
			else{ 
				fjpg.mv('./public/jpg/'+fjpg.name);
				fjpg = fjpg.name;
			}
			var fdocx = req.files.fdocx;
			if (fdocx == undefined) fdocx = 'null';
			else{
				fdocx.mv('./public/docx/'+fdocx.name); 
				fdocx = fdocx.name;
			}
			var fxlsx = req.files.fxlsx;
			if (fxlsx == undefined) fxlsx = 'null';
			else{
				fxlsx.mv('./public/xlsx/'+fxlsx.name); 
				fxlsx = fxlsx.name;
			}
			var fzip = req.files.fzip;
			if (fzip == undefined) fzip = 'null';
			else{
				fzip.mv('./public/zip/'+fzip.name); 
				fzip = fzip.name;
			}
			var frar = req.files.frar;
			if (frar == undefined) frar = 'null';
			else{
				frar.mv('./public/rar/'+frar.name); 
				frar = frar.name;
			}
			fjpg = '\'' + fjpg + '\'';
			fdocx = '\'' + fdocx + '\'';
			fxlsx = '\'' + fxlsx + '\'';
			fzip = '\'' + fzip + '\'';
			frar = '\'' + frar + '\'';
		}
		var ftext = req.body.firstname + "******" + req.body.lastname;
	    var connection = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "123456",
			database: "mydb"
		});
		connection.connect();

		connection.query("SELECT COUNT(id) as count FROM news", function(error, results, fields){
			if (error) throw error;
			var write = fs.writeFileSync('public/text/' + (Number(results[0].count)+1) + '.txt', ftext, 'utf8');
			res.render('admin', {count: results[0].count});
			a=Number(results[0].count)+1;
			
		});
		//console.log(a);
		var qr = "INSERT INTO news(jpg,docx,xlsx,zip,rar) VALUES("+fjpg+","+fdocx+","+fxlsx+","+fzip+","+frar+")";
		connection.query(qr);
		//console.log(fjpg);
		connection.end();
	}
	else{
		var connection = mysql.createConnection({
			host: "MyHost",
			user: "User",
			password: "MyPass",
			database: "MyDb"
		});
		connection.connect();
		var qr = "DELETE FROM news WHERE id =" + req.body.check_new;
		connection.query(qr);
		connection.query("SELECT COUNT(id) as count FROM news", function(error, results, fields){
			res.render('admin', {count: results[0].count});
		});
		connection.end();
	}
});

app.listen(PORT, 'MyHost');
console.log('Work!');