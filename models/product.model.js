const db = require('../utils/db');
const config = require('../config/default.json');

//product model
module.exports = {
    productCategory: (id) => db.load(`select * from products JOIN product_categories WHERE product_categories.cate_parent = ${id} `),

    all: () => db.load(`select * from products`),

    single: id => db.load(`select * from products where id= ${id}`),

    countByCate: async id => {
        const rows = await db.load(`select count(*) as total from products JOIN product_categories WHERE product_categories.product_cate = ${id} `)
        return rows[0].total;
    },

    autionPro: (id) => db.load(`SELECT b.name as name, h.created_at as tim, b.id as bidder, h.price as price, h.id as condi, h.product_id as pro FROM bidders b INNER JOIN history_auctions h ON b.id=h.bidder_id WHERE product_id=${id} `),

    pageByCate: (id, offset) => db.load(`select * from products where CatID = ${id} limit ${config.paginate.limit} offset ${offset}`),

    add: entity => db.add('products', entity),

    del: id_product => db.del('products', {
        id: id_product
    }),

    patch: entity => {
        const condition = {
            id: entity.id
        };
        delete entity.id;
        return db.patch('products', entity, condition);
    },

    productImage: id => db.load(`select * from products JOIN product_images on products.id=product_images.product_id WHERE product_images.product_id = ${id}`),
    productFail: (offset) => db.load(`select * from products WHERE status=0 limit ${config.paginate.limit} offset ${offset}`),
    productSuccess: (offset) => db.load(`select * from products WHERE status=1 limit ${config.paginate.limit} offset ${offset}`),
    productAction: (offset) => db.load(`select * from products WHERE status=2 limit ${config.paginate.limit} offset ${offset}`),
    countAction: async (id) => {
        const rows = await db.load(`select count(*) as total from products where status=2`)
        return rows[0].total;
    },
    countFail: async (id) => {
        const rows = await db.load(`select count(*) as total from products where status=0`)
        return rows[0].total;
    },
    countSuccess: async (id) => {
        const rows = await db.load(`select count(*) as total from products where status=1`)
        return rows[0].total;
    },

    bidderWin: (id) => db.load(`select MAX(his.price) as Price,  bidders.name as Win from products JOIN history_auctions his ON products.id = his.product_id JOIN bidders ON bidders.id=his.bidder_id WHERE (select count(*) FROM history_auctions his1 WHERE his1.price>his.price)=0 and products.id=${id}`),

    delImage: (id) => db.del('product_images', {
        product_id: id
    }),

    addBlock: (entity) => db.add('blocked_auctions', entity),

    delImage: (id) => db.del('product_images', {
        product_id: id
    }),
    topBidTimes: _ => db.load(`SELECT * FROM history_auctions LEFT OUTER JOIN products on products.id = history_auctions.product_id  GROUP BY product_id ORDER BY COUNT(*) DESC LIMIT 5`),
    currentPrice: (id) => db.load(`SELECT price from history_auctions WHERE id = ${id} and status = 2 ORDER BY price DESC LIMIT 1`),
    delHistory: (id) => {
        db.del('history_auctions', {
            id: id
        });
    },

    editDes: (id, des) => db.load(`UPDATE products Set description="${des}" WHERE id=${id}`)
}