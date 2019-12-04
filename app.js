//Require Modules
const express = require('express');
const bidders = require('./models/bidders.model');
const exphbs = require('express-handlebars');
//Express instance
const app = express();
const PORT = process.env.PORT | 3000;

app.use(express.static('views'))
app.engine('hbs', exphbs());
app.set('view engine', 'hbs');

app.get('/', async(req, res) => {
    res.render('index', { layout: false });
});
//Listen at PORT
app.listen(PORT, () => {
    console.log(`Listening Port: ${PORT}`);
});