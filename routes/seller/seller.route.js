const seller_route = require('express').Router();
const sellerModel = require('../../models/seller.model')
    //Home page
seller_route.get('/', (req, res) => {
        res.render('seller/dashboard',{layout: 'seller'});
})
// seller_route.get('/product',(req,res)=>{
//     res.render('seller/product',{layout: 'false'});
// })
// seller_route.get('/feedback',(req,res)=>{
//     res.render('seller/feedback', {layout: 'seller'});
// })
// seller_route.get('/bidding',(req,res)=>{
//     res.render('seller/product-bidding',{layout: 'seller'});
// })
// seller_route.get('/wishlist',(req,res)=>{
//     res.render('seller/product-wishlist',{layout: 'seller'});
// })
// seller_route.get('/won',(req,res)=>{
//     res.render('seller/product-won', {layout: 'seller'});
// })
module.exports=seller_route;