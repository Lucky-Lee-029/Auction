//Require Modules
const express = require('express');
const categoryModel = require('./models/category.model');
const adminModel = require('./models/admin_manager.model');
const exphbs = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
const session = require('express-session')
const passport = require('passport');
const morgan = require('morgan');
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
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(morgan('dev'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/views/public'))
app.use(express.static(__dirname + '/views/bidder'))
app.use(express.static(__dirname + '/views/admin'))
app.use(express.static(__dirname + '/views/seller'))
app.use(async(req, res, next) => {
    var data = await categoryModel.parentCategory();
    for (parent of data) {
        let children = await categoryModel.childCategory(parent.id);
        parent.hasChild = children.length;
        parent.children = children
    }
    res.locals.cate = { parent: data };
    res.locals.url = req.url;
    //Check logged in
    res.locals.isAuthenticated = false;
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        res.locals.isAuthenticated = true;
    }
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
        //login error
    if (req.session.hasError) {
        res.locals.hasError = true;
        res.locals.errorMessage = req.session.errorMessage;
        delete req.session.hasError;
    }
    //register error
    if (req.session.hasRegisterError) {
        res.locals.hasError = true;
        res.locals.errorMessage = req.session.errorMessage;
        delete req.session.hasRegisterError;
    }
    next();
})

//acount task
require('./middlewares/passport.mdw')(app, passport);
//User route
require('./middlewares/routes.mdw')(app);


app.use(function(err, req, res, next) {
    console.log(err);
    res.render('errors');
});

//Listen at PORT
app.listen(PORT, () => {
    console.log(`Listening Port: ${PORT}`);
});