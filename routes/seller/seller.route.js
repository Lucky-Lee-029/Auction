const seller_route = require('express').Router();
const sellerModel = require('../../models/seller.model')
    //Home page
seller_route.get('/', (req, res) => {
        res.render('seller/dashboard',{layout: 'seller'});
})
seller_route.get('/product', (req, res) => {
    res.render('seller/product',{layout: 'seller'});
})
seller_route.get('/profile',(req,res)=>{
    res.render('seller/profile',{layout: 'seller'});
})
seller_route.get('/end', (req, res) => {
    res.render('seller/product-ended',{layout: 'seller'});
})
seller_route.get('/add',(req,res)=>{
    res.render('seller/product-add',{layout: 'seller'});
})
seller_route.get('/edit',(req,res)=>{
    res.render('seller/product-edit-description',{layout: 'seller'});
})
seller_route.get('/remaining',(req,res)=>{
    res.render('seller/product-remaining', {layout: 'seller'});
})
module.exports=seller_route;