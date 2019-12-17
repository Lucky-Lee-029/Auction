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

route.get('/admin',(req, res)=>{
    res.render('admin/action',{layout: 'admin'});
})

route.get('/admin/product/action',(req, res)=>{
    res.render('admin/action', {layout: 'admin'});
})
route.get('/admin/product/pending',(req, res)=>{
    res.render('admin/pending', {layout: 'admin'});
})
route.get('/admin/product/success',(req, res)=>{
    res.render('admin/success', {layout: 'admin'});
})
route.get('/admin/product/fail',(req, res)=>{
    res.render('admin/fail', {layout: 'admin'});
})
route.get('/admin/product/blocked',(req, res)=>{
    res.render('admin/blocked', {layout: 'admin'});
})
route.get('/admin/user/bidder',(req, res)=>{
    res.render('admin/bidder', {layout: 'admin'});
})
route.get('/admin/user/bidder',(req, res)=>{
    res.render('admin/bidder', {layout: 'admin'});
})
route.get('/admin/user/seller',(req, res)=>{
    res.render('admin/seller', {layout: 'admin'});
})
route.get('/admin/user/upgrade',(req, res)=>{
    res.render('admin/upgrade-request', {layout: 'admin'});
})
route.get('/admin/user/bidder-blocked',(req, res)=>{
    res.render('admin/bidder-blocked', {layout: 'admin'});
})
route.get('/admin/user/seller-blocked',(req, res)=>{
    res.render('admin/seller-blocked', {layout: 'admin'});
})
route.get('/admin/category',(req, res)=>{
    res.render('admin/category', {layout: 'admin'});
})
route.get('/admin/faqs',(req, res)=>{
    res.render('admin/faqs', {layout: 'admin'});
})
module.exports = route;