//Require Modules
const express = require('express');
const bidders = require('./models/bidders.model');
const categoryModel = require('./models/category.model')
const exphbs = require('express-handlebars');
//Express instance
const app = express();
const PORT = process.env.PORT | 3000;

app.use(express.static(__dirname + '/views/public'))
    //Middleware
app.use(async(req, res, next) => {
    var data = await categoryModel.parentCategory();
    var child = [];
    for (parent of data) {
        child.push(await categoryModel.childCategory(parent.id));
    }
    res.locals.cate = { parent: data, child }
    next();
})

app.engine('hbs', exphbs());
app.set('view engine', 'hbs');

//User route
app.use('/', require('./routes/public/public.route'))

//Listen at PORT
app.listen(PORT, () => {
    console.log(`Listening Port: ${PORT}`);
});