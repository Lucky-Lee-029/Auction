const route = require('express').Router();
const productModel = require('../../models/product.model')
    //Home page
route.get('/', async(req, res) => {
        let topBidTimes = await productModel.topBidTimes();
        for (let product of topBidTimes) {
            let current_price = await productModel.currentPrice(product.id);
            current_price = current_price[0].price;
            product.current_price = current_price;
        }
        console.log('====================================');
        console.log(topBidTimes);
        console.log('====================================');
        res.render('index', { topBidTimes });
    })
    //about view
route.get('/about', (req, res) => {
        res.render('about');
    })
    //contact view
route.get('/contact', (req, res) => {
        res.render('contact');
    })
    //Product for each category
route.get('/category/:id', async(req, res) => {
    const id = req.params.id;
    const data = await productModel.productCategory(id);
    res.render('list_product', { data });;
})

//register
route.get('/register', (req, res) => {
    res.render('guest/Register');
});
module.exports = route;