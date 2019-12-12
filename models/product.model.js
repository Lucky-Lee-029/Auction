const db = require('../utils/db');
//product model
module.exports = {
    productCategory: (id) => db.load(`select * from products JOIN product_categories WHERE product_categories.id = ${id} `),
}