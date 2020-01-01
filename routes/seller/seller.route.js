const seller_route = require('express').Router();
const bodyParser = require('body-parser');
const sellerModel = require('../../models/seller.model');
const multer = require('multer');
var path = require('path');
var fs = require('fs');
seller_route.use(
	bodyParser.urlencoded({
		extended: true
	})
);
var storage = multer.diskStorage({
	destination: async (req, file, cb) => {
		var result = await sellerModel.maxId();
		var proId = JSON.parse(JSON.stringify(result))[0];
		var dir = 'C:\\Users\\Van Hai\\Desktop\\Auction\\views\\public\\images\\product\\' + String(proId.id + 1);
		if (!fs.existsSync(dir))
			fs.mkdirSync(
				dir,
				{
					recursive: true
				},
				(err) => {}
			);
		console.log(dir);
		cb(null, dir);
	},
	filename: function(req, file, cb) {
		console.log(file);
		cb(null, file.originalname);
	}
});

var upload = multer({
	storage: storage
});

//Home page
seller_route.get('/', (req, res) => {
	res.render('seller/dashboard', {
		layout: 'seller'
	});
});
seller_route.get('/product', (req, res) => {
	res.render('seller/product', {
		layout: 'seller'
	});
});
seller_route.get('/profile', (req, res) => {
	res.render('seller/profile', {
		layout: 'seller'
	});
});
seller_route.get('/end', (req, res) => {
	res.render('seller/product-ended', {
		layout: 'seller'
	});
});
seller_route.get('/add', (req, res) => {
	res.render('seller/product-add', {
		layout: 'seller'
	});
});
seller_route.get('/edit', (req, res) => {
	res.render('seller/product-edit-description', {
		layout: 'seller'
	});
});
seller_route.get('/remaining', (req, res) => {
	var id = req.query.id;
	res.render('seller/product-remaining', {
		layout: 'seller'
	});
});
seller_route.post('/add', upload.array('fuMain', 5), async (req, res, next) => {
	const file = req.body.fuMain;
	var id = req.query;
	var result = await sellerModel.maxId();
	var proId = JSON.parse(JSON.stringify(result))[0];
	// var create_at = new Date(year, month, day, hours, minutes, seconds, milliseconds);
	// create_at = Date.now();
	var create_at = '2020-1-1';
	var dua = '2020-1-1';
	console.log(create_at);

	for (var i = 0; i < req.files.length; i++) {
		fs.rename(req.files[i].path, req.files[i].destination + '/' + String(i), function(err) {
			errorcode = err;
		});
	}

	await sellerModel.insert(
		proId.id + 1,
		1,
		req.body.name,
		req.body.startPrice,
		req.body.endPrice,
		req.body.stepPrice,
		1,
		req.body.description,
		create_at,
		dua
	);
	res.render('seller/add-success', {
		layout: 'seller'
	});
});
module.exports = seller_route;
