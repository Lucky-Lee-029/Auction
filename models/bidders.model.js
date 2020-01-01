const db = require('../utils/db');
const tableName = 'bidders';
module.exports = {
    all: () => db.load(`select * from ${tableName}`),
    single: id => db.load(`select * from ${tableName} where id=${id}`),
    add: entity => db.add(tableName, entity),
    del: id_bid => db.del(tableName, { id: id_bid }),
    patch: entity => {
        const condition = { id: entity.id };
        delete entity.id;
        // console.log(condition, entity);
        return db.patch(tableName, entity, condition);
    },
    name: (id) => db.load(`select name from ${tableName} where id=${id}`),
    singleByEmail: (email) => db.load(`select * from ${tableName} where email = '${email}'`),
    singleByFacebookId: (fbId) => db.load(`select * from ${tableName} where facebook_id = '${fbId}'`)
}