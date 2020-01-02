const seller_route = require('express').Router();
const bodyParser = require('body-parser');
const sellerModel = require('../../models/seller.model');
const productModel = require('../../models/product.model');
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
                dir, {
                    recursive: true
                },
                (err) => {}
            );
        console.log(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
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
seller_route.get('/product', async (req, res) => {
    var id = req.query.id;
    var items = await sellerModel.singPro(id);
    var data = JSON.parse(JSON.stringify(items))[0];
    var bidder = await productModel.autionPro(id);
    console.log(bidder);
    res.render('seller/product', {
        layout: 'seller',
        data,
        bidder
    });
});
seller_route.post('/product', async (req, res) => {
    var bidder_id = req.body.idBidder;
    var id = req.body.idAuction;
    var product_id = req.body.idPro;
    var entity = [];
    entity.push({
        product_id: product_id,
        bidder_id: bidder_id
    });
    await productModel.addBlock(entity);
    await productModel.delHistory(id);
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
seller_route.get('/add', async (req, res) => {
    var items = await sellerModel.cat();
    res.render('seller/product-add', {
        layout: 'seller',
        items
    });
});
seller_route.get('/edit', (req, res) => {
    res.render('seller/product-edit-description', {
        layout: 'seller'
    });
});
seller_route.get('/remaining', async (req, res) => {
    var get = await sellerModel.sellId(req.user.id);
    var id = JSON.parse(JSON.stringify(get))[0];
    var items = await sellerModel.allActive(id.seller_id);
    res.render('seller/product-remaining', {
        layout: 'seller',
        items
    });
});
seller_route.post('/add', upload.array('fuMain', 5), async (req, res, next) => {
    //Lấy id nè
    var get = await sellerModel.sellId(req.user.id);
    var id = JSON.parse(JSON.stringify(get))[0];
    const file = req.body.fuMain;
    var result = await sellerModel.maxId();
    var proId = JSON.parse(JSON.stringify(result))[0];
    console.log(req.query);
    var time = new Date();
    var create_at = '2020-1-2';
    var dua = '2020-1-1';
    for (var i = 0; i < req.files.length; i++) {
        fs.rename(req.files[i].path, req.files[i].destination + '/' + String(i), function (err) {
            errorcode = err;
        });
    }

    await sellerModel.insert(
        proId.id + 1,
        id.seller_id,
        req.body.name,
        req.body.startPrice,
        req.body.endPrice,
        req.body.stepPrice,
        req.body.autorenew,
        req.body.description,
        create_at,
        dua
    );
    res.render('seller/add-success', {
        layout: 'seller'
    });
});
module.exports = seller_route;