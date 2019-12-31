const db = require('../utils/db');
module.exports = {
    parentCategory: () => db.load('select * from categories where cate_parent IS NULL'),
    childCategory: (parent) => db.load(`select * from categories where cate_parent = ${parent}`),
    all:()=> db.load(`select * from categories`),
    add: entity =>{
        if(entity.cate_parent==="0"){
            delete entity.cate_parent;
        }
        db.add('categories',entity)
    },    
}