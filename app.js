//Require Modules
const express = require('express');
const bidders = require('./models/bidders.model');
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
        section: express_handlebars_sections()
    }
}));
app.set('view engine', 'hbs');
//Middleware
app.use(express.static(__dirname + '/views/public'))
app.use(async(req, res, next) => {
    var data = await categoryModel.parentCategory();
    var child = [];
    for (parent of data) {
        child.push(await categoryModel.childCategory(parent.id));
    }
    res.locals.cate = { parent: data, child }
    next();
})

//User route
app.use('/', require('./routes/public/public.route'))
app.use(function(err, req, res, next) {
    res.render('errors')
});
//Listen at PORT
app.listen(PORT, () => {
    console.log(`Listening Port: ${PORT}`);
});