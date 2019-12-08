const db = require('../utils/db');
module.exports = {
    parentCategory: () => db.load('select * from categories where cate_parent IS NULL'),
    childCategory: (parent) => db.load(`select * from categories where cate_parent = ${parent}`)
}