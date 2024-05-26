CREATE TABLE `unpaid_invoice_5147` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ar_id` int(11) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `sql_data` varchar(1024) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `status` tinyint(2) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `log_location` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_name` varchar(255) DEFAULT NULL,
  `location_code` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `location_status` tinyint(2) DEFAULT NULL,
  `location_shipper` tinyint(1) NOT NULL DEFAULT '0',
  `location_billto` tinyint(1) NOT NULL DEFAULT '0',
  `location_carrier_type` tinyint(1) DEFAULT NULL,
  `location_lh_carrier` tinyint(1) DEFAULT NULL,
  `location_beyond_carrier` tinyint(1) DEFAULT NULL,
  `location_advanced_carrier` tinyint(1) DEFAULT NULL,
  `location_warehouse` tinyint(1) DEFAULT NULL,
  `location_terminal_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`location_id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;