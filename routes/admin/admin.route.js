const route = require('express').Router();
const productModel= require('../../models/product.model')
const bidderModel=require('../../models/bidders.model')
const categoryModel=require('../../models/category.model')
const config=require('../../config/default.json')
const sellerModel=require('../../models/seller.model')
const upgradeModel=require('../../models/upgrade_request.model')

//route home
route.get('/dashboard',(req, res)=>{
    res.render('admin/dashboard/dashboard',{layout: 'admin'});
})

route.get('/',(req, res)=>{
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
route.get('/user/bidder',async(req, res)=>{
    var list=[];
    const limit=config.paginate.limit;
    const page = req.query.page || 1;
    if(page<1) page =1;
    const offset = (page -1)* config.paginate.limit;
    list =await bidderModel.all(offset);
    for(parent of list){
        const total=await bidderModel.totalReviews(parent.id);
        if(total>0){
            const point=await bidderModel.pointReviews(parent.id);
            parent.Point=(point/total)*100;
        }
        else{
            parent.Point=100;
        }
    }
    const total = await bidderModel.count();
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
        value: i,
        isCurrentPage: i === +page
        })
    }
    res.render('admin/users/bidder', {
        layout: 'admin',
        list,
        page_numbers,
        not_prev: +page-1===0,
        not_next: +page===+nPages,
        prev_value: +page - 1,
        next_value: +page + 1,
    });
})
route.get('/user/seller', async (req, res)=>{
    var list=[];
    const limit=config.paginate.limit;
    const page = req.query.page || 1;
    if(page<1) page =1;
    const offset = (page -1)* config.paginate.limit;
    list =await sellerModel.all(offset);
    for(parent of list){
        const total=await sellerModel.totalReviews(parent.id);
        if(total>0){
            const point=await sellerModel.pointReviews(parent.id);
            parent.Point=(point/total)*100;
        }
        else{
            parent.Point=100;
        }
    }
    const total = await sellerModel.count();
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
        value: i,
        isCurrentPage: i === +page
        })
    }
    res.render('admin/users/seller', {
        layout: 'admin',
        list,
        page_numbers,
        not_prev: +page-1===0,
        not_next: +page===+nPages,
        prev_value: +page - 1,
        next_value: +page + 1,
    });
})
route.get('/user/upgraderequest',async (req, res)=>{
    var list =[];
    const limit=config.paginate.limit;
    const page = req.query.page || 1;
    if(page<1) page =1;
    const offset = (page -1)* config.paginate.limit;
    list = await upgradeModel.all(offset);
    const total = await upgradeModel.count();
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
        value: i,
        isCurrentPage: i === +page
        })
    }
    res.render('admin/users/upgrade-request', {
        layout: 'admin',
        list,
        page_numbers,
        not_prev: +page-1===0,
        not_next: +page===+nPages,
        prev_value: +page - 1,
        next_value: +page + 1,
    });
})

route.get('/user/upgraderequest/delete/:id', async(req, res)=>{
    const result = await upgradeModel.del(req.params.id)
    res.redirect('/admin/user/upgraderequest');
})

route.post('/user/upgraderequest/add',async(req, res)=>{
    const result= await upgradeModel.del(req.body.id);
    const result1= await sellerModel.add(req.body.id);
})
// End route user



//route category
route.get('/category',async(req, res)=>{
    let list=await categoryModel.all();
    for(parent of list){
        if(parent.cate_parent){
            let nameParent=await categoryModel.name(parent.cate_parent);
            parent.nameParent=nameParent[0].name;
        }
    }
    res.render('admin/category/category', {
        layout: 'admin',
        list,
    });
})

route.post('/category/add',async(req, res)=>{
    const result = await categoryModel.add(req.body);
    res.redirect('/admin/category');
})

route.get('/category/edit/:id',async(req, res)=>{
    let list=await categoryModel.all();
    let single=await categoryModel.single(req.params.id);
    for(parent of list){
        parent.isSelected= (single[0].cate_parent===+parent.id);
        if(parent.cate_parent){
            let nameParent=await categoryModel.name(parent.cate_parent);
            parent.nameParent=nameParent[0].name;
        }
    }
    res.render('admin/category/category', {
        layout: 'admin',
        list,
        single: single[0],
        isEdit: 1,
    });

})

route.post('/category/edit/:id',async(req, res)=>{
    const result = await categoryModel.patch(req.body, req.params.id);
    res.redirect('/admin/category');
})

route.get('/category/delete/:id', async(req, res)=>{
    let children = await categoryModel.childCategory(req.params.id);
    let product= await categoryModel.productCate(req.params.id);
    if(children.length || product.length){
    }
    else{
        const result = await categoryModel.del(req.params.id);
    }
    res.redirect('/admin/category');
})
//end route cate

//route account
route.get('/login',(req, res)=>{
    res.render('admin/accounts/login',{layout: false});
})
route.get('/logout',(req, res)=>{
    res.redirect('/admin/login');
})
//end route account
module.exports=route;