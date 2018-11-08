const express = require('express');
const app = express();
const body_parser = require('body-parser');
const ejs = require('ejs');
const request = require('request');
const fs = require('fs');

var users = [];
//Get users from existing JSON
var exists = fs.existsSync('users.json');
if(exists){
	console.log('loading existing users');
	let text = fs.readFileSync('users.json','utf8');
	users = JSON.parse(text);
	console.log(users);
} else {
	console.log('no words to load');
}


app.use(body_parser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');


//Get
app.get('/',(req,res)=>{
	res.render('index', {sun_data: null});
});

app.get('/signup',(req,res)=>{
	res.render('signup', {sun_data: null});
});

app.get('/calculator',(req,res)=>{
	res.render('calculator', {sun_data: null});
});


//Post
app.post('/signup',(req,res)=>{
	console.log('SIGN UP SUBMITTED');
	let user = {
		name : req.body.name,
		username: req.body.username,
		password : req.body.password
	}
	console.log(user);
	users.push(user);
	//Write user into JSON file
	let json = JSON.stringify(users);
	fs.writeFile('users.json',json,'utf8',()=>{
		console.log('Usering writing complete');
		res.redirect('./calculator'); //Send to Main App
	});
});

app.post('/calculator',(req,res)=>{
	console.log('request: ' + req.body.latitude + ', '+ req.body.longitude);
	let lat = req.body.latitude;
	let lng = req.body.longitude
	let url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;
	
	request(url,(err,resp,body)=>{
		if(err){
			console.log(`Error: ${err}`);
			res.render('calculator', {sun_data: null});
		} else {
			let data = JSON.parse(body);
			let time_diff = sunCalculations(data);

			if(data.results == undefined){
				console.log(`Error: ${err}`);
				res.render('calculator', {sun_data: null});
			} else {
				console.log('request success: ');
				console.log(data.results);
				res.render('calculator', {sun_data: time_diff})
			}
		}
	});
});

app.listen(3000,()=>{
	console.log('listening at 3000...');
});

const sunCalculations=(data)=>{
	console.log('running calcs')
	let date = new Date(); //Get Current date
	let hour = date.getUTCHours();
	let min = date.getUTCMinutes();

	//Isolate hours & mins of Sunrise/Sunset times
	let setHour = parseInt(data.results.sunset.split('T')[1].split(':')[0]);
	let setMin = parseInt(data.results.sunset.split('T')[1].split(':')[1]);
	let riseHour = parseInt(data.results.sunrise.split('T')[1].split(':')[0]);
	let riseMin = parseInt(data.results.sunrise.split('T')[1].split(':')[1]);

	//Calcuating Functions
	const calcRiseDiff = (curr,rise) =>{
		console.log('Calculating time until Sunrise');
		let hours = rise[0] - curr[0];
		let minutes = rise[1] - curr[1];
		if(hours < 0){
			hours = 24 + hours;
		}
		if(minutes < 0){ //Account for negative results
			hours -= 1;
			minutes = 60 + minutes;
		}
		console.log(`${hours} hours and ${minutes} minutes until sunrise`);
		let difference = {
			"type" : "sunrise",
			"timeCurr" : [curr[0],curr[1]],
			"timeEvent" : [rise[0],rise[1]],
			"timeDiff" : [hours, minutes],
			"timeEnd" : "am"
		}
		return difference;
	}

	const calcSetDiff = (curr, set) =>{
		console.log('Calculating time until Sunset');
		let hours = set[0] - curr[0];
		let minutes = set[1] - curr[1];
		if(minutes < 0){ //Account for negative results
			hours -= 1;
			minutes = 60 + minutes;
		}

		console.log(`${hours} hours and ${minutes} minutes until sunset`);
		let difference = {
			"type" : "sunset",
			"timeCurr" : [curr[0],curr[1]],
			"timeEvent" : [set[0],set[1]],
			"timeDiff" : [hours, minutes],
			"timeEnd" : "pm"
		}
		return difference;
	}

	//Calculate time until sunset Here
	if((hour>riseHour) || (hour==riseHour && min > riseMin)){ //if past sunrise
		if((hour == setHour && min < setMin) || (hour < setHour)){ //not yet sunset
			return calcSetDiff([hour,min],[setHour,setMin]);
		} else if((hour == setHour && min > setMin) || (hour>setHour)){ //past sunrise and sunset
			return calcRiseDiff([hour,min],[riseHour,riseMin]);
		}
	} else if ((hour<riseHour) || (hour == riseHour && min < riseMin)){ //if before sunrise
		return calcRiseDiff([hour,min],[riseHour,riseMin]);
	}

	//Debug console logs
	console.log('curr: ' + hour + ':' + min);
	console.log('sunset: '+ setHour + ':' + setMin);
	console.log('sunrise: '+ riseHour + ':' + riseMin);

}