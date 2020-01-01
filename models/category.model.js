const db = require('../utils/db');
module.exports = {
    parentCategory: () => db.load('select * from categories where cate_parent IS NULL'),
    childCategory: (parent) => db.load(`select * from categories where cate_parent = ${parent}`),
    all:()=> db.load(`select * from categories`),
    add: entity =>{
        if(entity.cate_parent==="0"){
            delete entity.cate_parent;
        }
        db.add('categories',entity);
    },
    del: id_cate=> db.del('categories',{id: id_cate}),
    single: (id)=> db.load(`select * from categories where id = ${id}`),
    patch: (entity, id) => {
        const condition={id: id};
        if(entity.cate_parent==="0"){
            delete entity.cate_parent;
        }
        return db.patch('categories',entity, condition);
    },
    name: id => db.load(`select name from categories where id=${id}`)
}