const seller_route = require('express').Router();
const bodyParser = require('body-parser');
const bidderModel = require('../../models/bidders.model');
const sellerModel = require('../../models/seller.model');
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model.js');
const reviewModel = require('../../models/reviews.model');
const utils = require('../../utils/utils');
const multer = require('multer');
const cookie = require('cookie-parser');
const moment = require('moment');
var path = require('path');
var fs = require('fs');
seller_route.use(cookie());

seller_route.use(
    bodyParser.urlencoded({
        extended: true
    })
);
var storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        var result = await sellerModel.maxId();
        var proId = JSON.parse(JSON.stringify(result))[0];
        var dir =
            __dirname.substring(0, __dirname.indexOf('\\routes')) +
            '\\views\\public\\images\\product\\' +
            String(proId.id + 1);

        if (!fs.existsSync(dir))
            fs.mkdirSync(
                dir, {
                    recursive: true
                },
                (err) => {}
            );
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

seller_route.get('/product/:id', async (req, res) => {
    var id = req.params.id;
    if (typeof (req.user) == 'undefined')
        return res.redirect('/product/' + id);
    let product = await productModel.single(id);
    product = product[0];
    if (product.seller_id != req.user.id)
        return res.redirect('/bidder/product/' + id);
    let categories = await categoryModel.cateOfProduct(id);
    product.categories = categories;
    product.seller_review = "" + await bidderModel.pointReviews(product.seller_id) + "/" + await bidderModel.totalReviews(product.seller_id);
    let currentPrice = await productModel.currentPrice(id);
    if (currentPrice.length > 0) {
        product.hasWinner = true;
        product.price = currentPrice[0].price;
        product.winner_name = currentPrice[0].name;
        product.winner_review = "" + await bidderModel.pointReviews(currentPrice[0].id) + "/" + await bidderModel.totalReviews(currentPrice[0].id);
        let bidTimes = await productModel.bidTimes(product.id);
        product.bidTimes = bidTimes[0].bidTimes;
    } else {
        product.price = product.price_start;
        product.hasWinner = false;
    }
    let seller_name = await sellerModel.nameOfSeller(product.seller_id);
    product.seller_name = seller_name[0].name;
    product.end_time = utils.formatDuration(product.duration);


    var bidder = await productModel.autionPro(id);
    res.render('seller/product', {
        layout: 'main',
        product,
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
seller_route.get('/end', async (req, res) => {
    var id = req.user.id;
    var data = await productModel.listEnd(id);
    res.render('seller/product-ended', {
        layout: 'seller',
        data
    });
});
seller_route.get('/add', async (req, res) => {
    var items = await sellerModel.cat();
    res.render('seller/product-add', {
        layout: 'seller',
        items
    });
});
seller_route.post('/edit', async (req, res) => {
    var id = req.body.idToDes;
    console.log(id);
    var pro = await productModel.single(id);
    var data = JSON.parse(JSON.stringify(pro))[0];
    res.cookie('edit', data);
    res.redirect('./editDescription');
});
seller_route.get('/editDescription', (req, res) => {
    var data = req.cookies.edit;
    res.render('seller/product-edit-description', {
        layout: 'seller',
        data
    });
});

seller_route.post('/editDescription', async (req, res) => {
    var data = req.body.oldDes + req.body.description;
    var id = req.body.id;
    await productModel.editDes(id, data);
    var items = await sellerModel.singPro(id);
    var data = JSON.parse(JSON.stringify(items))[0];
    var bidder = await productModel.autionPro(id);
    res.render('seller/product', {
        layout: 'seller',
        data,
        bidder
    });
});

seller_route.get('/remaining', async (req, res) => {
    var get = await sellerModel.sellId(req.user.id);
    var id = JSON.parse(JSON.stringify(get))[0];
    var day = moment().format();
    var items = await sellerModel.allActive(id.seller_id, day);
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
    var create_at = moment().format();
    var dua = moment().add(7, 'days').format();
    for (var i = 0; i < req.files.length; i++) {
        fs.rename(req.files[i].path, req.files[i].destination + '/' + String(i + 1) + '.jpg', function (err) {
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
    var catProId = proId.id + 1;
    var cat = req.body.parent_id;
    await categoryModel.addProduct(cat, catProId);
    var day = moment().format();
    var items = await sellerModel.allActive(req.user.id, day);
    res.render('seller/product-remaining', {
        layout: 'seller',
        items
    });
});
seller_route.post('/feedback', async (req, res) => {
    var data = req.body;
    var at = moment().format();
    await sellerModel.feedback(req.body.product, req.body.bidder, req.body.rating, req.body.message, at);
    var id = req.user.id;
    var data = await productModel.listEnd(id);
    res.render('seller/product-ended', {
        layout: 'seller',
        data
    });
});
seller_route.post('/view-product', async (req, res) => {
    var id = req.body.id;
    console.log(id);
    res.cookie('id', id);
    res.redirect('./editDescription');
});
seller_route.get('/view-product', async (req, res) => {
    var id = req.cookies.id;
    var items = await sellerModel.singPro(id);
    var bidder = await productModel.autionPro(id);
    for (bid of bidder) {
        bid.tim = moment(bid.tim, "YYYY-MM-DD-hh-mm-ss").format("YYYY-MM-DD hh:mm:ss");
    }
    var data = JSON.parse(JSON.stringify(items))[0];
    data.duration = moment(data.duration, "YYYY-MM-DD-hh-mm-ss").format("YYYY-MM-DD hh:mm:ss");
    res.render('seller/product', {
        layout: 'seller',
        data,
        bidder
    });
});
seller_route.post('/watchreview', (req, res) => {
    var id = req.body.idBidder;
    res.cookie("bidder", id);
    res.redirect('./editDescription');
})
seller_route.get('/watchreview', async (req, res) => {
    var id = req.cookies.bidder;
    var review = await reviewModel.viewReview(id);
    for (rew of review) {
        rew.good = (rew.love == 1);
    }
    console.log(review);
    res.render("seller/review", {
        layout: 'seller',
        review
    });
});
module.exports = seller_route;