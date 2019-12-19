const db = require('../utils/db');
const tableName = 'seller';

module.exports = {
    all: () => db.load(`select * from ${tableName}`),
    single: (id) => db.load(`select * from ${tableName} where id=${id}`),
    add: (tableName, entity)=>db.add(tableName,entity),
    del: (tableName, condition) =>db.del(tableName, condition),
    patch: entity => 
    {
        const condition = { id: entity.id };
        delete entity.id;
        // console.log(condition, entity);
        return db.patch(tableName, entity, condition);
    }
}