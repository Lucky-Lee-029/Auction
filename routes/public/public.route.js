const route = require('express').Router();
const productModel = require('../../models/product.model')
const categoryModel = require('../../models/category.model');
const sellerModel = require('../../models/seller.model');
const utils = require('../../utils/utils');
const moment = require('moment');
//Home page
route.get('/', async (req, res) => {
    let topBidTimes = await productModel.topBidTimes();

    for (let product of topBidTimes) {
        let current_price = await productModel.currentPrice(product.id);
        current_price = current_price[0].price;
        product.current_price = current_price;
        //get current time
        product.remaining_time = utils.formatDuration(product.duration);
    }
    res.render('index', {
        topBidTimes
    });
});
//about view
route.get('/about', (req, res) => {
    res.render('about');
})
//contact view
route.get('/contact', (req, res) => {
    res.render('contact');
})
//Product for each category
route.get('/category/:id', async (req, res) => {
    const id = req.params.id;
    const data = await productModel.productCategory(id);
    res.render('list_product', {
        data
    });;
})

route.get('/product/:id', async (req, res) => {
    const id = req.params.id;
    let product = await productModel.single(id);
    product = product[0];
    let categories = await categoryModel.cateOfProduct(id);
    let currentPrice = await productModel.currentPrice(id);
    product.categories = categories;
    product.price = currentPrice[0].price;
    product.winner_name = currentPrice[0].name;
    let seller_name = await sellerModel.nameOfSeller(product.seller_id);
    product.seller_name = seller_name[0].name;
    product.end_time = utils.formatDuration(product.duration);
    console.log(product)
    res.render('guest/Product', {
        product
    });

});

module.exports = route;