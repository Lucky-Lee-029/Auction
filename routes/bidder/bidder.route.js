const bidder_route = require('express').Router();
const bidderModel = require('../../models/bidders.model')
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const sellerModel = require('../../models/seller.model');
const history_auctionModel = require('../../models/history_auctions.model');
const utils = require('../../utils/utils');
const moment = require('moment');
//Home page
bidder_route.get('/', (req, res) => {
        res.render('bidder/dashboard', { layout: 'admin' });
    })
    //product view for bidder
bidder_route.get('/product/:id', async(req, res) => {
    const id = req.params.id;
    if (req.session.bidError) {
        if (id == req.session.errorOnId) {
            res.locals.bidError = true;
            res.locals.errorMessage = req.session.bidMessage;
            delete req.session.bidError;
            delete req.session.errorId;
            delete req.session.bidMessage;
        }
    }
    if (typeof(req.user) == 'undefined')
        return res.redirect('/product/' + id);
    let product = await productModel.single(id);
    product = product[0];
    if (product.seller_id == req.user.id)
        return res.redirect('/seller/product/' + id);
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

    var userId = req.user.id;
    var total = await bidderModel.totalReviews(userId);
    var like = await bidderModel.pointReviews(userId);
    var canBid = await bidderModel.canBid(userId, product.id);
    if (canBid.length == 0) canBid = true;
    else canBid = false;
    var allowToBid = false;
    if ((like == total && total == 0) || (like * 100 / total > 80))
        allowToBid = true;
    allowToBid = allowToBid && canBid;
    var bidders = await productModel.autionPro(id);
    for (var bidder of bidders) {
        bidder.tim = moment(bidder.tim).format("HH:mm:ss DD/MM/YYYYY");
    }
    res.render('bidder/product', { layout: 'main', product, allowToBid, bidder: bidders });
})

bidder_route.post('/bid', async(req, res) => {
    var { price, productId } = req.body;
    //if price is acc and bidder is not be block from bid this then add to dtb
    var canBid = await bidderModel.canBid(req.user.id, productId);
    if (canBid.length == 0) canBid = true;
    else canBid = false;
    if (canBid) {
        var product = await productModel.single(productId);
        product = product[0]
        var currentPrice = await productModel.currentPrice(productId);
        currentPrice = currentPrice[0]
            //price is ac
        if (price % product.step == 0 && price > Math.max(currentPrice.price, product.price_start))
            await history_auctionModel.add({
                created_at: moment().format(),
                product_id: productId,
                bidder_id: req.user.id,
                price,
                status: 1
            })
        else {
            req.session.errorOnId = productId;
            req.session.bidError = true;
            req.session.bidMessage = "Price is not accepted";
        }
    } else {
        req.session.errorOnId = productId;
        req.session.bidError = true;
        req.session.bidMessage = "You are not allow to bid";
    }
    res.redirect(`/bidder/product/${productId}`);
});
bidder_route.post('/feedback', async(req, res) => {
    var id = req.user.id;
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
    var data = await productModel.listWon(id);
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