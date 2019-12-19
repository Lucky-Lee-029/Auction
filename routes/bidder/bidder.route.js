const bidder_route = require('express').Router();
const bidderModel = require('../../models/bidders.model')
    //Home page
bidder_route.get('/', (req, res) => {
        res.render('bidder/dashboard',{layout: 'admin'});
})
bidder_route.get('/product',(req,res)=>{
    res.render('bidder/product', {layout: 'admin'});
})
bidder_route.get('/feedback',(req,res)=>{
    res.render('bidder/feedback', {layout: 'admin'});
})
bidder_route.get('/bidding',(req,res)=>{
    res.render('bidder/product-bidding',{layout: 'admin'});
})
bidder_route.get('/wishlist',(req,res)=>{
    res.render('bidder/product-wishlist',{layout: 'admin'});
})
bidder_route.get('/won',(req,res)=>{
    res.render('bidder/product-won', {layout: 'admin'});
})
module.exports=bidder_route;