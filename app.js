//Require Modules
const express = require('express');
const bidders = require('./models/bidders.model');
const sellers=require('./models/seller.model');
const categoryModel = require('./models/category.model');
const adminModel = require('./models/admin_manager.model');
const exphbs = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
//Express instance
const app = express();
const PORT = process.env.PORT | 3000;
//View engine
app.engine('hbs', exphbs({
    helpers: {
        section: express_handlebars_sections(),
        formatName: (name) => name.toLowerCase().split(' ').join('')
    }
}));
app.set('view engine', 'hbs');
//Middleware
app.use(express.static(__dirname + '/views/public'))
app.use(express.static(__dirname + '/views/bidder'))
app.use(express.static(__dirname + '/views/seller'))
app.use(async(req, res, next) => {
    var data = await categoryModel.parentCategory();
    for (parent of data) {
        let children = await categoryModel.childCategory(parent.id);
        parent.hasChild = children.length;
        parent.children = children
    }
    res.locals.cate = { parent: data };
    next();
})
app.use(async(req, res, next) => {
        var data = [];
        data = await adminModel.parentManager();
        for (parent of data) {
            let children = await adminModel.childManager(parent.id)
            parent.hasChild = children.length;
            parent.children = children;
        }
        res.locals.admin = { parent: data }
        next();
    })
    //User route
app.use('/', require('./routes/public/public.route'))
app.use('/bidder', require('./routes/bidder/bidder.route'))
app.use('/seller', require('./routes/seller/seller.route'))
// app.use('/admin',require('./routes/admin/admin.route'))


app.use(function(err, req, res, next) {
    res.render('errors')
});

//Listen at PORT
app.listen(PORT, () => {
    console.log(`Listening Port: ${PORT}`);
});