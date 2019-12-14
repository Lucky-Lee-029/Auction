const db = require('../utils/db');
module.exports = {
    parentManager: () => db.load('select * from admin_managers where parent_id IS NULL'),
    childCategory: (parent) => db.load(`select * from admin_managers where parent_id = ${parent}`)
}