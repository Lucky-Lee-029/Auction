const route = require('express').Router();
const adminModel = require('../../models/admin_manager.model')
const productModel= require('../../models/product.model')
const bidderModel=require('../../models/bidders.model')
const config=require('../../config/default.json')

route.get('/dashboard',(req, res)=>{
    res.render('admin/dashboard/dashboard',{layout: 'admin'});
})




// Route product
route.get('/product/action',async (req, res)=>{
    var list=[];
    const limit=config.paginate.limit;
    const page = req.query.page || 1;
    if(page<1) page =1;
    const offset = (page -1)* config.paginate.limit;
    list= await productModel.productAction(offset);
    for (parent of list) {
        let Image = await productModel.productImage(parent.id);
        let seller=await bidderModel.name(parent.seller_id);
        parent.Image = Image;
        parent.seller=seller[0];
    }
    const total = await productModel.countAction();
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
        value: i,
        isCurrentPage: i === +page
        })
    }
    res.render('admin/products/action', {
        layout: 'admin', 
        list,
        page_numbers,
        not_prev: +page-1===0,
        not_next: +page===+nPages,
        prev_value: +page - 1,
        next_value: +page + 1,
    });
})
route.get('/product/success',async (req, res)=>{
    var list=[];
    const limit=config.paginate.limit;
    const page = req.query.page || 1;
    if(page<1) page =1;
    const offset = (page -1)* config.paginate.limit;
    list= await productModel.productSuccess(offset);
    for (parent of list) {
        let Image = await productModel.productImage(parent.id);
        let seller=await bidderModel.name(parent.seller_id);
        let bidder=await productModel.bidderWin(parent.id);
        parent.Price=bidder[0].Price;
        parent.Win=bidder[0].Win;
        parent.Image = Image;
        parent.seller=seller[0];
    }
    const total = await productModel.countSuccess();
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
        value: i,
        isCurrentPage: i === +page
        })
    }
    res.render('admin/products/success', {
        layout: 'admin', 
        list,
        page_numbers,
        not_prev: +page-1===0,
        not_next: +page===+nPages,
        prev_value: +page - 1,
        next_value: +page + 1,
    });
})
route.get('/product/fail',async (req, res)=>{
    var list=[];
    const limit=config.paginate.limit;
    const page = req.query.page || 1;
    if(page<1) page =1;
    const offset = (page -1)* config.paginate.limit;
    list= await productModel.productFail(offset);
    for (parent of list) {
        let Image = await productModel.productImage(parent.id);
        let seller=await bidderModel.name(parent.seller_id);
        parent.Image = Image;
        parent.seller=seller[0];
    }
    const total = await productModel.countFail();
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
        value: i,
        isCurrentPage: i === +page
        })
    }
    res.render('admin/products/fail', {
        layout: 'admin', 
        list,
        page_numbers,
        not_prev: +page-1===0,
        not_next: +page===+nPages,
        prev_value: +page - 1,
        next_value: +page + 1,
    });
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