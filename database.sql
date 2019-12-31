-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';



DROP TABLE IF EXISTS `bidders`;
CREATE TABLE `bidders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `adress` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `avatar` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: not verified, 1: verified, 2: blocked',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bidders_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `bidders` (`name`, `adress`, `email`, `avatar`, `birthday`, `password`, `status`) VALUES
('Son', 'HCM', 'son@gmail.com', 'images/avatar/son.jpg', '1999-2-28', 'xyafjka32478qwehdakejf', '1');

DROP TABLE IF EXISTS `sellers`;
CREATE TABLE `sellers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `seller_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `expiry_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bidders_seller_id_foreign` (`seller_id`),
  CONSTRAINT `bidders_seller_id_foreign` FOREIGN KEY (`seller_id`) REFERENCES `bidders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `sellers` (`seller_id`, `created_at`, `expiry_date`) VALUES
(1, '2019-12-4 03:05:09',  '2019-12-4 03:05:09');

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT ,
  `seller_id` int(10) unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `price_start` int(11) DEFAULT NULL,
  `price_end` int(11) DEFAULT NULL,
  `buy_now` int(11) DEFAULT NULL,
  `step` int(11) DEFAULT NULL,
  `auto-renew` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: not, 1: yes',
  `description` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `duration` timestamp NULL DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: fail, 1: success, 2: spending, 3: action, 4: blocked',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sellers_seller_id_foreign` (`seller_id`),
  CONSTRAINT `sellers_seller_id_foreign` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`seller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `products` (`id`, `seller_id` ,`name`, `price_start`, `price_end`, `buy_now`, `step`, `auto-renew`, `description`, `duration`,`status`, `created_at`) VALUES
(1, 1,'laptop msi gv62' , 10000000, 20000000, 20000000 ,100000 , 1, 'laptop giá rẻ trong tầm tay', 'duration' ,'1', '2019-12-4 03:05:09'),
(2, 1,'laptop dell' ,20000000, 30000000, 30000000 ,100000 , 1, 'laptop giá rẻ trong tầm tay', 'duration' ,'1', '2019-13-4 03:05:09'),
(3, 1,'laptop asus' , 15000000, 20000000, 20000000 ,100000 , 1, 'laptop giá rẻ trong tầm tay', 'duration' ,'1', '2019-19-4 03:05:09'),
(4, 1,'laptop hp' , 18000000, 25000000, 25000000 ,100000 , 1, 'laptop giá rẻ trong tầm tay', 'duration' ,'1', '2019-15-4 03:05:09'),
(5, 1,'laptop acer' , 19000000, 26000000, 26000000 ,200000 , 1, 'laptop giá rẻ trong tầm tay', 'duration' ,'1', '2019-27-4 03:05:09');

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `image` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `product_images` (`product_id`, `image`) VALUES
(1 , '/images/categories/1.jpg');

DROP TABLE IF EXISTS `descriptions`;
CREATE TABLE `descriptions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `descriptions_product_id_foreign` (`product_id`),
  CONSTRAINT `descriptions_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `descriptions` (`product_id`, `description`, `created_at`) VALUES
(1, 'description', '2019-12-4 03:05:09');

DROP TABLE IF EXISTS `history_auctions`;
CREATE TABLE `history_auctions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `bidder_id` int(10) unsigned NOT NULL,
  `price` int(11) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: fail, 1: success, 2: spending, 3: cancel',
  PRIMARY KEY (`id`),
  KEY `history_auctions_product_id_foreign` (`product_id`),
  KEY `history_auctions_bidder_id_foreign` (`bidder_id`),
  CONSTRAINT `history_auctions_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `history_bidders_product_id_foreign` FOREIGN KEY (`bidder_id`) REFERENCES `bidders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `history_auctions` (`product_id`, `bidder_id`, `price`, `created_at`, `status`) VALUES
(1, 1, 16000000, '2019-12-4 03:05:09', 2);

DROP TABLE IF EXISTS `bidder_reviews`;
CREATE TABLE `bidder_reviews` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `bidder_id` int(10) unsigned NOT NULL,
  `love` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: dislike, 1: like',
  `review` text COLLATE utf8_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bidder_reviews_product_id_foreign` (`product_id`),
  CONSTRAINT `bidder_reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `bidder_reviews` (`product_id`, `bidder_id`, `love`, `review`, `created_at`) VALUES
(1, 1, 1, 'good', '2019-12-4 03:05:09');

DROP TABLE IF EXISTS `seller_reviews`;
CREATE TABLE `seller_reviews` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `bidder_id` int(10) unsigned NOT NULL,
  `love` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: dislike, 1: like',
  `review` text COLLATE utf8_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seller_reviews_product_id_foreign` (`product_id`),
  CONSTRAINT `seller_reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `seller_reviews` (`product_id`, `bidder_id`, `love`, `review`, `created_at`) VALUES
(1, 1, 1, 'good', '2019-12-4 03:05:09');


DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `cate_parent` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_cate_parent_foreign` (`cate_parent`),
  CONSTRAINT `categories_cate_parent_foreign` FOREIGN KEY (`cate_parent`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `categories` (`name`, `cate_parent`) VALUES
('điện tử', NULL);

DROP TABLE IF EXISTS `product_categories`;
CREATE TABLE `product_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_product_id_product_categories_foreign` (`product_id`),
  KEY `categories_category_id_product_categories_foreign` (`category_id`),
  CONSTRAINT `products_product_id_product_categories_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `categories_category_id_product_categories_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
(1,1);

DROP TABLE IF EXISTS `sliders`;
CREATE TABLE `sliders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `image` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `status`  tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: unactivity, 1: activity',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `sliders` (`image`, `status`) VALUES
('/images/avatar/son.jpg', 1);

DROP TABLE IF EXISTS `blocked_auctions`;
CREATE TABLE `blocked_auctions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `bidder_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_product_id_blocked_auctions_foreign` (`product_id`),
  KEY `bidders_bidder_id_blocked_auctions_foreign` (`bidder_id`),
  CONSTRAINT `products_product_id_blocked_auctions_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `bidders_bidder_id_blocked_auctions_foreign` FOREIGN KEY (`bidder_id`) REFERENCES `bidders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `blocked_auctions` (`product_id`, `bidder_id`) VALUES
(1,1);

DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `adress` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `avatar` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `admins` (`name`, `adress`, `email`, `avatar`, `birthday`,`password`) VALUES
('son', 'HCM', 'son@gmail.com','images/avatar/son.jpg', '2019-12-4 03:05:09', '34358791fsdjfszvcas');

DROP TABLE IF EXISTS `admin_managers`;
CREATE TABLE `admin_managers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `icon` varchar(20) COLLATE utf8_unicode_ci,
  `parent_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_managers_parent_id_foreign` (`parent_id`),
  CONSTRAINT `admin_managers_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `admin_managers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `admin_managers` (`name`, `icon`, `parent_id`) VALUES
('Dashboard', 'icon-speedometer',  NULL),
('Product', 'ti-layout-grid2', NULL),
('User','ti-user', NULL),
('Category', 'ti-palette', NULL),
('FAQ', 'ti-star', NULL),
('Slider', ' ti-layout-slider', NULL),
('Pending', NULL, 2),
('Action', NULL, 2),
('Success', NULL, 2),
('Fail', NULL, 2),
('Blocked', NULL, 2),
('Seller', NULL, 3),
('Bidder', NULL, 3),
('Upgrade Request', NULL, 3),
('Blocked Bidder', NULL, 3),
('Blocked Seller', NULL, 3);

DROP TABLE IF EXISTS `seller_managers`;
CREATE TABLE `seller_managers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `icon` varchar(20) COLLATE utf8_unicode_ci,
  `parent_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seller_managers_parent_id_foreign` (`parent_id`),
  CONSTRAINT `seller_managers_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `seller_managers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `seller_managers` (`name`, `icon`, `parent_id`) VALUES
('Dashboard', 'icon-speedometer',  NULL),
('Product', 'ti-layout-grid2', NULL),
('User','ti-user', NULL),
('Category', 'ti-palette', NULL),
('FAQ', 'ti-star', NULL),
('Slider', ' ti-layout-slider', NULL),
('Pending', NULL, 2),
('Action', NULL, 2),
('Success', NULL, 2),
('Fail', NULL, 2),
('Blocked', NULL, 2),
('Seller', NULL, 3),
('Bidder', NULL, 3),
('Upgrade Request', NULL, 3),
('Blocked Bidder', NULL, 3),
('Blocked Seller', NULL, 3);

DROP TABLE IF EXISTS `upgrade_requests`;
CREATE TABLE `upgrade_requests` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bidder_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `upgrade_requests_bidder_id_foreign` (`bidder_id`),
  CONSTRAINT `upgrade_requests_bidder_id_foreign` FOREIGN KEY (`bidder_id`) REFERENCES `bidders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;





































