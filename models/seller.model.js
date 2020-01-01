const db = require('../utils/db');
const tableName = 'seller';

module.exports = {
	all: () => db.load(`select * from ${tableName}`),
	single: (id) => db.load(`select * from ${tableName} where id=${id}`),

	insert(pro_id, id, name, price_start, price_end, step, auto_renew, description, duaration, created_at) {
		return db.load(
			`INSERT INTO products (id, seller_id ,name, price_start, price_end, buy_now, step, auto_renew, description, duration,status, created_at) VALUES
            (${pro_id},${id},"${name}",${price_start},${price_end},${price_end},${step},${auto_renew},"${description}",${duaration},1,${created_at})`
		);
	},

	maxId: () => db.load(`SELECT Max(id) as id From products`),

	del: (tableName, condition) => db.del(tableName, condition),

	patch: (entity) => {
		const condition = {
			id: entity.id
		};
		delete entity.id;
		// console.log(condition, entity);
		return db.patch(tableName, entity, condition);
	}
};
