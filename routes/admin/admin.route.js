const route = require('express').Router();
const adminModel = require('../../models/admin_manager.model')
const productModel= require('../../models/product.model')

route.get('/',(req, res)=>{
    res.render('admin/dasboard',{layout: 'admin'});
})

route.get('/dashboard',(req, res)=>{
    res.render('admin/dashboard',{layout: 'admin'});
})

route.get('/product/action',async (req, res)=>{
    var list=[];
    list= await productModel.productAction();
    res.render('admin/action', {layout: 'admin', list});
})

route.get('/product/edit/:id', async (req,res)=>{
    var row = await productModel.single(req.params.id);
    res.render('admin/products/edit', {layout: 'admin', single: row[0]});
})

route.get('/product/adđ', async (req,res)=>{
    var row = await productModel.single(req.params.id);
    res.render('admin/products/edit', {layout: 'admin', single: row[0]});
})


route.get('/product/pending',(req, res)=>{
    res.render('admin/pending', {layout: 'admin'});
})
route.get('/product/success',(req, res)=>{
    res.render('admin/success', {layout: 'admin'});
})
route.get('/product/fail',(req, res)=>{
    res.render('admin/fail', {layout: 'admin'});
})
route.get('/product/blocked',(req, res)=>{
    res.render('admin/blocked', {layout: 'admin'});
})
route.get('/admin/user/bidder',(req, res)=>{
    res.render('admin/bidder', {layout: 'admin'});
})
route.get('/user/bidder',(req, res)=>{
    res.render('admin/bidder', {layout: 'admin'});
})
route.get('/user/seller',(req, res)=>{
    res.render('admin/seller', {layout: 'admin'});
})
route.get('/user/upgraderequest',(req, res)=>{
    res.render('admin/upgrade-request', {layout: 'admin'});
})
route.get('/user/blockedbidder',(req, res)=>{
    res.render('admin/bidder-blocked', {layout: 'admin'});
})
route.get('/user/blockedseller',(req, res)=>{
    res.render('admin/seller-blocked', {layout: 'admin'});
})
route.get('/category',(req, res)=>{
    res.render('admin/category', {layout: 'admin'});
})
route.get('/faq',(req, res)=>{
    res.render('admin/faqs', {layout: 'admin'});
})

route.get('/slider',(req, res)=>{
    res.render('admin/slider', {layout: 'admin'});
})
route.get('/login',(req, res)=>{
    res.render('admin/login', {layout: 'admin'});
})
route.get('/profile',(req, res)=>{
    res.render('admin/profile');
})
module.exports=route;