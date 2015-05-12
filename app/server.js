var express = require('express'),
	bodyParser = require('body-parser'),
	uuid = require('uuid'),
	jade = require('jade'),
	nodemailer = require('nodemailer'),
	fs = require('fs');


var app = express(),
	imgDir = __dirname + '/uploads/',
	templateDir = __dirname + '/templates/';

var sender = 'manoir.de.kernault@gmail.com';
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: sender,
		pass: 'kernault'
	}
});

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname + '/public/'));

app.post('/api/photo',function(req,res){
	// callback hell FTW!!
	saveImage(req.body.img, function(err, imgPath) {
		if (err) {
			res.status(500).end(err);
		}
		else {
			var templateOptions = { data: 'blablabla' };
			generateMail(templateOptions, function(err, mail) {
				if (err) {
					res.status(500).end(err);
				}
				else {
					sendMail(mail, imgPath, function(err, info) {
						if (err) {
							res.status(500).end(err);
						}
						else {
							//console.log(info);
							res.status(200).end('OK');
						}
					});
				}
			});
		}
	});
});

app.listen(3000,function(){
	console.log('localhost:3000');
});

var saveImage = function(imgData, callback) {
	var fileName = imgDir + 'photo-' + uuid.v1() + '.png';
	console.log('Saving: ' + fileName);
	fs.writeFile(fileName, imgData, 'base64', function(err) {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, fileName);
		}
	});
};

var generateMail = function(templateOptions, callback) {
	var fileName = templateDir + 'email.jade';
	console.log('Loading: ' + fileName);
	fs.readFile(fileName, 'utf8', function (err, data) {
		if (err) {
			callback(err, null);
		}
		else {
			var fn = jade.compile(data);
			var mail = fn(templateOptions);
			callback(null, mail);
		}
	});
};

var sendMail = function(mail, imgPath, callback) {
	var mailOptions = {
		from: sender,
		to: 'xavier.seignard@gmail.com',
		subject: 'Un souvenir du Manoir de Kernault',
		html: mail,
		attachments: [
			{
				filename: 'souvenir.png',
				path: imgPath
			}
		]
	};
	transporter.sendMail(mailOptions, function(err, info){
		if(err){
			callback(err, null);
		}
		else{
			callback(null, info);
		}
	});

};
