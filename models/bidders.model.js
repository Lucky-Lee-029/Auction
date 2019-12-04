const db = require('../utils/db');
const tableName = 'bidders';
module.exports = {
    all: () => db.load(`select * from ${tableName}`),
}