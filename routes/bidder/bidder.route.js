const bidder_route = require('express').Router();
const bidderModel = require('../../models/bidders.model')
const productModel = require('../../models/product.model')
//Home page
bidder_route.get('/', (req, res) => {
    res.render('bidder/dashboard', {
        layout: 'admin'
    });
})
//product view for bidder
bidder_route.get('/product', (req, res) => {
    res.render('bidder/product', {
        layout: 'main'
    });
})
bidder_route.get('/feedback', (req, res) => {
    res.render('bidder/feedback', {
        layout: 'bidder'
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
bidder_route.get('/won', async (req, res) => {
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