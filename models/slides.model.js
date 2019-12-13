const db = require('../utils/db');
const tableName = 'slides';

module.exports = {
    all: () => db.load(`select * from ${tableName}`),
    add: entity => db.add(tableName, entity),
    del: id_slide => db.del(tableName, { id: id_slide }),
    patch: entity => {
        const condition = { id: entity.id };
        delete entity.id;
        // console.log(condition, entity);
        return db.patch(tableName, entity, condition);
    }
}