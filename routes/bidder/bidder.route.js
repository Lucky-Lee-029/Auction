const bidder_route = require('express').Router();
const bidderModel = require('../../models/bidders.model')
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const sellerModel = require('../../models/seller.model');
const history_auctionModel = require('../../models/history_auctions.model');
const upgradeRequestModel = require('../../models/upgrade_request.model');
const utils = require('../../utils/utils');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
// create mail transporter
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "greatestauctionever",
        pass: "greatestauctionever123456789"
    }
});
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
    let duration = moment(product.duration, "DD-MM-YYYY-HH-mm-ss");
    let secondsDiff = duration.diff(moment(), "seconds");
    if (secondsDiff <= 0) {
        //Time out 
        allowToBid = false;
    }
    for (var bidder of bidders) {
        bidder.tim = moment(bidder.tim).format("HH:mm:ss DD/MM/YYYYY");
    }
    res.render('bidder/product', {
        layout: 'main',
        product,
        allowToBid,
        bidder: bidders
    });
})
bidder_route.use((req, res, next) => {
    if (typeof(req.user) == 'undefined') {
        req.session.loginModal = true;
        return res.redirect('/');
    }
    next();
});
//Home page
bidder_route.get('/', (req, res) => {
    res.render('bidder/dashboard', { layout: 'bidder' });
})
    //product view for bidder

bidder_route.post('/bid', async(req, res) => {
    var {
        price,
        productId
    } = req.body;
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
            try {
                var result = await history_auctionModel.add({
                    created_at: moment().format(),
                    product_id: productId,
                    bidder_id: req.user.id,
                    price,
                    status: 1
                })
                if (result.affectedRows == 1) {
                    //Gửi mail đặt giá thành công
                    let mailOptions = {
                        from: "greatestauctionever@gmail.com",
                        to: req.user.email,
                        subject: `Bid successful`,
                        text: `You had bid successful for product: ${product.name} with price: ${price}`
                    };
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            throw error;
                        } else {
                            console.log(`Email to ${req.user.email} successfully sent!`);
                        }
                    });
                }
            } catch (e) {

            }
        else {
            let duration = moment(product.duration, "DD-MM-YYYY-HH-mm-ss");
            let secondsDiff = duration.diff(moment(), "seconds");
            if (secondsDiff <= 0) {
                req.session.errorOnId = productId;
                req.session.bidError = true;
                req.session.bidMessage = "Time was up";
            } else {
                var currentPrice = await productModel.currentPrice(productId);
                currentPrice = currentPrice[0]
                    //price is ac
                if (price % product.step == 0 && price > Math.max(currentPrice.price, product.price_start)) {
                    await history_auctionModel.add({
                        created_at: moment().format(),
                        product_id: productId,
                        bidder_id: req.user.id,
                        price,
                        status: 1
                    })
                    if (product.auto_renew) {

                        if (secondsDiff < 5 * 60) {
                            let newDuration = duration.add(10, "minutes");
                            await productModel.patch({
                                id: product.id,
                                duration: newDuration
                            })
                        }

                    }
                } else {
                    req.session.errorOnId = productId;
                    req.session.bidError = true;
                    req.session.bidMessage = "Price is not accepted";
                }
            }
        }
    }
    res.redirect(`/bidder/product/${productId}`);
});

bidder_route.post('/bid', async(req, res) => {
    var {
        price,
        productId
    } = req.body;
    //if price is acc and bidder is not be block from bid this then add to dtb
    var canBid = await bidderModel.canBid(req.user.id, productId);
    if (canBid.length == 0) canBid = true;
    else canBid = false;
    if (canBid) {
        var product = await productModel.single(productId);
        product = product[0]
        let duration = moment(product.duration, "DD-MM-YYYY-HH-mm-ss");
        let secondsDiff = duration.diff(moment(), "seconds");
        if (secondsDiff <= 0) {
            //Time out 
            req.session.errorOnId = productId;
            req.session.bidError = true;
            req.session.bidMessage = "Time was up";
        } else {
            var currentPrice = await productModel.currentPrice(productId);
            currentPrice = currentPrice[0]
                //price is ac
            if (price % product.step == 0 && price > Math.max(currentPrice.price, product.price_start)) {
                await history_auctionModel.add({
                    created_at: moment().format(),
                    product_id: productId,
                    bidder_id: req.user.id,
                    price,
                    status: 1
                })
                if (product.auto_renew) {

                    if (secondsDiff < 5 * 60) {
                        let newDuration = duration.add(10, "minutes");
                        await productModel.patch({
                            id: product.id,
                            duration: newDuration
                        })
                    }

                }
            } else {
                req.session.errorOnId = productId;
                req.session.bidError = true;
                req.session.bidMessage = "Price is not accepted";
            }
        }
    } else {
        req.session.errorOnId = productId;
        req.session.bidError = true;
        req.session.bidMessage = "You are not allow to bid";
    }
    res.redirect(`/bidder/product/${productId}`);
});
bidder_route.get('/bidding', async(req, res) => {
    var id = req.user.id;
    var data = await productModel.biddingList(id);
    for (product of data) {
        var price = await productModel.currentPrice(product.id);
        product.price = price[0].price;
        product.winner = price[0].name;
        product.him = (price[0].id == product.me);
        product.duration = utils.formatDuration(product.duration);
    }
    console.log(data);
    res.render('bidder/product-bidding', {
        layout: 'bidder',
        data
    });
})
bidder_route.get('/wishlist', async(req, res) => {
    var id = req.user.id;
    list = await productModel.WishList(id);
    res.render('bidder/product-wishlist', {
        layout: 'bidder',
        list
    });
})
bidder_route.post('/wishlist/delete', async(req, res) => {
        var id = req.body.id;
        var bidder_id = req.user.id;
        productModel.delWish(id, bidder_id);
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
        layout: 'bidder'
    });
})
bidder_route.get('/uplevel', async(req, res) => {
    var result = await upgradeRequestModel.single(req.user.id);
    var requested = false;
    if (result.length > 0) {
        requested = true;
    }
    res.render('bidder/upgrade-to-seller', {
        layout: 'bidder',
        requested
    });
})
bidder_route.post('/uplevel', async(req, res) => {
    var { password } = req.body;
    if (bcrypt.compareSync(password, req.user.password)) {
        //add to up level list
        await upgradeRequestModel.add({ bidder_id: req.user.id });
    }
    res.redirect('./uplevel');
})

module.exports = bidder_route;