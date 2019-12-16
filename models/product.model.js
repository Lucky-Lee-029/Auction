const db = require('../utils/db');
const config = require('../config/default.json');

//product model
module.exports = {
    productCategory: (id) => db.load(`select * from products JOIN product_categories WHERE product_categories.product_cate = ${id} `),

    all: () => db.load(`select * from products`),

    actionProduct: () => db.load(`select * from products WHERE `),

    single: id => db.load(`select * from products where id= ${id}`),

    countByCate: async id => {
        const rows = await db.load(`select count(*) as total from products JOIN product_categories WHERE product_categories.product_cate = ${id} `)
        return rows[0].total;
    },

    pageByCate: (id, offset) => db.load(`select * from products where CatID = ${id} limit ${config.paginate.limit} offset ${offset}`),

    add: entity => db.add('products', entity),

    del: id_product => db.del('products', { id: id_product}),

    patch: entity => {
        const condition = { id: entity.id };
        delete entity.id;
        return db.patch('products', entity, condition);
    },

    productImage: id => db.load(`select * from products JOIN product_images WHERE product_images.product_id = ${id} `),   
}