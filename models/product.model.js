// const db = require('../utils/db');
// const config = require('../config/default.json');

// //product model
// module.exports = {
//     productCategory: (id) => db.load(`select * from products JOIN product_categories WHERE product_categories.product_cate = ${id} `),

//     all: () => db.load(`select * from products`),

//     single: id => db.load(`select * from products where id= ${id}`),

//     countByCate: async id => {
//         const rows = await db.load(`select count(*) as total from products JOIN product_categories WHERE product_categories.product_cate = ${id} `)
//         return rows[0].total;
//     },

//     pageByCate: (id, offset) => db.load(`select * from products where CatID = ${id} limit ${config.paginate.limit} offset ${offset}`),

//     add: entity => db.add('products', entity),

//     del: id_product => db.del('products', { id: id_product}),

//     patch: entity => {
//         const condition = { id: entity.id };
//         delete entity.id;
//         return db.patch('products', entity, condition);
//     },

//     productImage: id => db.load(`select * from products JOIN product_images WHERE product_images.product_id = ${id} `),   
// }
const db = require('../utils/db');
const config = require('../config/default.json');

//product model
module.exports = {
<<<<<<< HEAD
    productCategory: (id) => db.load(`select * from products JOIN product_categories WHERE product_categories.category_id = ${id}`),
=======
    productCategory: (id) => db.load(`select * from products JOIN product_categories WHERE product_categories.category_id = ${id} `),
>>>>>>> 1675bfe113e02cbca8db124005c00399657be5ca

    all: () => db.load(`select * from products`),

    actionProduct: () => db.load(`select * from products WHERE `),

    single: id => db.load(`select * from products where id= ${id}`),

    countByCate: async id => {
<<<<<<< HEAD
        const rows = await db.load(`select count(*) as total from products JOIN product_categories WHERE product_categories.category_id = ${id}`)
=======
        const rows = await db.load(`select count(*) as total from products JOIN product_categories WHERE product_categories.category_id = ${id} `)
>>>>>>> 1675bfe113e02cbca8db124005c00399657be5ca
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

    productImage: id => db.load(`select * from products JOIN product_images WHERE product_images.product_id = ${id}`),   
}