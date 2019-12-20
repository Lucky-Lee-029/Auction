const route = require('express').Router();
const productModel = require('../../models/product.model')
    //Home page
route.get('/', (req, res) => {
        res.render('index');
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

module.exports = route;