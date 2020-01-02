const db = require('../utils/db');
const config = require('../config/default.json');
const tableName = 'sellers';

module.exports = {
    all: (offset) => db.load(`select * from ${tableName} JOIN bidders ON bidders.id=sellers.seller_id limit ${config.paginate.limit} offset ${offset}`),
    single: (id) => db.load(`select * from ${tableName} where id=${id}`),

    insert(pro_id, id, name, price_start, price_end, step, auto_renew, description, duaration, created_at) {
        return db.load(
            `INSERT INTO products (id, seller_id ,name, price_start, price_end, buy_now, step, auto_renew, description, duration,status, created_at) VALUES
            (${pro_id},${id},"${name}",${price_start},${price_end},${price_end},${step},${auto_renew},"${description}",${duaration},1,${created_at})`
        );
    },

    maxId: () => db.load(`SELECT Max(id) as id From products`),

    allActive: (id) => db.load(`select * from products where status=1 and seller_id=${id}`),

    del: (tableName, condition) => db.del(tableName, condition),

    patch: (entity) => {
        const condition = {
            id: entity.id
        };
        delete entity.id;
        // console.log(condition, entity);
        return db.patch(tableName, entity, condition);
    },
    totalReviews: async (id) =>{
        const rows=await db.load(`select count(*) as total from sellers JOIN bidder_reviews ON sellers.id=bidder_reviews.seller_id WHERE sellers.id=${id}`)
        return rows[0].total;
    },
    pointReviews: async (id) =>{
        const rows= await db.load(`select count(*) as total from sellers JOIN bidder_reviews ON sellers.id=bidder_reviews.seller_id WHERE sellers.id=${id} and seller_reviews.love=1`)
        return rows[0].total;
    },
    count: async () =>{
        const rows= await db.load(`select count(*) as total from sellers`)
        return rows[0].total;
    },
    add:(id)=>{
        const condition={seller_id: id};
        db.add('sellers', condition);
    }
};