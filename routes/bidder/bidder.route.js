const bidder_route = require('express').Router();
const bidderModel = require('../../models/bidders.model')
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const sellerModel = require('../../models/seller.model');
const utils = require('../../utils/utils');
//Home page
bidder_route.get('/', (req, res) => {
        res.render('bidder/dashboard', { layout: 'admin' });
    })
    //product view for bidder
bidder_route.get('/product/:id', async(req, res) => {
    const id = req.params.id;
    let product = await productModel.single(id);
    product = product[0];
    let categories = await categoryModel.cateOfProduct(id);
    product.categories = categories;
    product.seller_review = "" + await bidderModel.pointReviews(product.seller_id) + "/" + await bidderModel.totalReviews(product.seller_id);
    let currentPrice = await productModel.currentPrice(id);
    console.log(currentPrice)
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
    console.log(product);

    res.render('bidder/product', { layout: 'main', product, isBidder: true });
})
bidder_route.post('/feedback', async(req, res) => {
    var id = req.user.id;
    console.log(data);
    console.log(req.body)
    var at = moment().format();
    await bidderModel.feedback(req.body.pro, id, req.body.rating, req.body.message, at);
    var data = await productModel.listWon(id);
    res.render('bidder/product-won', {
        layout: 'bidder',
        data
    });
})
bidder_route.get('/bidding', (req, res) => {
    res.render('bidder/product-bidding', {
        layout: 'bidder'
    });
})
bidder_route.get('/wishlist', (req, res) => {
        res.render('bidder/product-wishlist', {
            layout: 'main'
        });
    })
    // List won
bidder_route.get('/won', async(req, res) => {
    var id = req.user.id;
    console.log(id);
    var data = await productModel.listWon(id);
    console.log(data);
    res.render('bidder/product-won', {
        layout: 'bidder',
        data
    });
})
bidder_route.get('/password', (req, res) => {
    res.render('bidder/update-password', {
        layout: 'main'
    });
})
bidder_route.get('/uplevel', (req, res) => {
    res.render('bidder/upgrade-to-seller', {
        layout: 'bidder'
    });
})
module.exports = bidder_route;