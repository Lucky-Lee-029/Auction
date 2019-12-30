const route = require('express').Router();
const adminModel = require('../../models/admin_manager.model')
const productModel= require('../../models/product.model')
const bidderModel=require('../../models/bidders.model')
const config=require('../../config/default.json')

route.get('/',(req, res)=>{
    res.render('admin/dasboard',{layout: 'admin'});
})

route.get('/dashboard',(req, res)=>{
    res.render('admin/dashboard/dashboard',{layout: 'admin'});
})




// Route product
route.get('/product/action',async (req, res)=>{
    var list=[];
    const page = req.params.page || 1;
    if(page<1) page =1;
    const offset = (page -1)*config.paginate.limit;
    list= await productModel.productAction();
    for (parent of list) {
        // let Image = await productModel.productImage(parent.id);
        let bidder=await bidderModel.name(parent.id);
        // parent.Image = Image;
        parent.bidder=bidder[0];
    }
    res.render('admin/products/action', {
        layout: 'admin', 
        list,
    });
})
route.get('/product/success',async (req, res)=>{
    var list=[];
    list= await productModel.productSuccess();
    for (parent of list) {
        let Image = await productModel.productImage(parent.id)
        let bidder=await bidderModel.name(parent.id)
        parent.Image = Image;
        parent.bidder=bidder[0];
    }
    res.render('admin/products/success', {layout: 'admin', list});
})
route.get('/product/pending',(req, res)=>{
    res.render('admin/products/pending', {layout: 'admin'});
})
route.get('/product/fail',(req, res)=>{
    res.render('admin/products/fail', {layout: 'admin'});
})
route.get('/product/blocked',(req, res)=>{
    res.render('admin/products/blocked', {layout: 'admin'});
})


route.get('/product/edit/:id', async (req,res)=>{
    var row = await productModel.single(req.params.id);
    res.render('admin/products/edit', {layout: 'admin', single: row[0]});
})
route.get('/product/add', async (req,res)=>{
    res.render('admin/products/add', {layout: 'admin'});
})
// End route product


// Route user
route.get('/user/bidder',(req, res)=>{
    res.render('admin/users/bidder', {layout: 'admin'});
})
route.get('/user/seller',(req, res)=>{
    res.render('admin/users/seller', {layout: 'admin'});
})
route.get('/user/upgraderequest',(req, res)=>{
    res.render('admin/users/upgrade-request', {layout: 'admin'});
})
route.get('/user/blockedbidder',(req, res)=>{
    res.render('admin/users/bidder-blocked', {layout: 'admin'});
})
route.get('/user/blockedseller',(req, res)=>{
    res.render('admin/users/seller-blocked', {layout: 'admin'});
})
// End route user


route.get('/category',(req, res)=>{
    res.render('admin/category/category', {layout: 'admin'});
})
route.get('/faq',(req, res)=>{
    res.render('admin/faqs/faqs', {layout: 'admin'});
})

route.get('/slider',(req, res)=>{
    res.render('admin/slider/slider', {layout: 'admin'});
})
route.get('/login',(req, res)=>{
    res.render('admin/accounts/login', {layout: 'admin'});
})
route.get('/profile',(req, res)=>{
    res.render('admin/accounts/profile');
})
module.exports=route;