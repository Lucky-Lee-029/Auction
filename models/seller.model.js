const db = require('../utils/db');
const tableName = 'seller';

module.exports = {
    all: () => db.load(`select * from ${tableName}`),
    edit:(entity, condition) => db.patch(tableName,entity,condition ),

}