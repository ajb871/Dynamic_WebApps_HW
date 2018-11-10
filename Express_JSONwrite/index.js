console.log('app starting')
const express = require('express');
const app = express();
const fs = require('fs');

const server = app.listen(3000, function listenting(){
	console.log('app listening...');
});

var data = fs.readFileSync('people.json');
var people = JSON.parse(data);
//console.log(people);

//Variable routes that save data to a JSON file
//Route to view entire contents of JSON

//static homepage
app.use(express.static('public'));

//route for adding values
app.get('/add/:username/:password', addValue);
function addValue(req, res) {
	console.log('\nadd value route');
	var data = req.params;
	var username = data.username;
	var password = data.password;
	people[username] = password;
	var data = JSON.stringify(people);

	fs.writeFile('people.json', data, function(err){
		if (err){
			console.log('error: ' + err);
			return;
		}
		console.log('input written to JSON');
	});
	res.send('Logged in! Welcome ' + username);
}

//route for viewing all values
app.get('/all', viewAll);
function viewAll(req,res){
	res.send(people);
}