var mysql = require ('mysql');
var connection = mysql.createConnection({
	host: "MyHost",
	user: "User",
	password: "MyPass",
	database: "MyDb"
});
connection.connect();
connection.query("CREATE TABLE news(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, jpg VARCHAR(40) NULL, docx VARCHAR(40) NULL, xlsx VARCHAR(40) NULL, zip VARCHAR(40) NULL, rar VARCHAR(40) NULL)", function(error, results, fields){
	if (error) throw error;
	console.log("Table created!");
});
connection.end();