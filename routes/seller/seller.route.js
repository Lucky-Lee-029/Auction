const seller_route = require('express').Router();
const bodyParser= require('body-parser');
const sellerModel = require('../../models/seller.model');
const multer = require('multer');
var path = require("path");
seller_route.use(bodyParser.urlencoded({extended: true}));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'views\\public\\images\\product')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
   
  var upload = multer({ storage: storage })

//Home page
seller_route.get('/', (req, res) => {
    res.render('seller/dashboard', {
        layout: 'seller'
    });
})
seller_route.get('/product', (req, res) => {
    res.render('seller/product', {
        layout: 'seller'
    });
})
seller_route.get('/profile', (req, res) => {
    res.render('seller/profile', {
        layout: 'seller'
    });
})
seller_route.get('/end', (req, res) => {
    res.render('seller/product-ended', {
        layout: 'seller'
    });
})
seller_route.get('/add', (req, res) => {
    res.render('seller/product-add', {
        layout: 'seller'
    });
})
seller_route.get('/edit', (req, res) => {
    res.render('seller/product-edit-description', {
        layout: 'seller'
    });
})
seller_route.get('/remaining', (req, res) => {
    res.render('seller/product-remaining', {
        layout: 'seller'
    });
})
seller_route.post('/add', upload.single('fuMain'), (req, res, next) => {
        const file = req.body.fuMain;
        console.log(file);
        res.send(file);
    });
module.exports = seller_route;