const db = require('../utils/db');

module.exports = {
    sellerReview: () => db.load(`select * from seller_reviews`),
    addSellerReview: entity => db.add(sellerReview, entity),
    del: id_rev => db.del(seller_reviews, { id: id_rev }),


    bidderReview: () => db.load(`select * from bidder_reviews`),
    addBidderReview: entity => db.add(bidderReview, entity),
    del: id_rev => db.del(bidder_reviews, { id: id_rev }),}
}