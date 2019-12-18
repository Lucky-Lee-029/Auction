const route = require('express').Router();
const productModel = require('../../models/bidders.model')
    //Home page
route.get('/bidder', (req, res) => {
        res.render('bidder/dashboard');
})
route.get('/bidder/product',(req,res)=>{
    res.render('bidder/product');
})
route.get('/bidder/feedback',(req,res)=>{
    res.render('bidder/feedback');
})
route.get('/bidder/feedback',(req,res)=>{
    res.render('bidder/feedback');
})
route.get('/bidder/bidding',(req,res)=>{
    res.render('bidder/product-bidding');
})
route.get('/bidder/wishlist',(req,res)=>{
    res.render('bidder/product-wishlist');
})
route.get('/bidder/won',(req,res)=>{
    res.render('bidder/product-won');
})
