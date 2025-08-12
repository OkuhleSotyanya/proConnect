CREATE DATABASE IF NOT EXISTS `pro_connect` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pro_connect`;

-- Disable foreign key checks temporarily to drop tables
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `contractors`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `admin_details`;
DROP TABLE IF EXISTS `client_details`;
DROP TABLE IF EXISTS `contractor_details`;

-- Create roles table to define available roles
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL, -- e.g., 'admin', 'client', 'contractor'
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert default roles
INSERT INTO `roles` (`role_name`, `description`) VALUES
('admin', 'System administrator with full access'),
('client', 'Client who can request jobs'),
('contractor', 'Contractor who can accept and perform jobs');

-- Create unified users table
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(300) NOT NULL,
  `role_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create admin_details table for admin-specific data
CREATE TABLE `admin_details` (
  `user_id` int NOT NULL,
  `work_email` varchar(255) DEFAULT NULL, -- Optional admin-specific field
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create client_details table for client-specific data
CREATE TABLE `client_details` (
  `user_id` int NOT NULL,
  `fullname` varchar(150) DEFAULT NULL,
  `phone_number` varchar(150) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL, -- Added address column
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create contractor_details table for contractor-specific data
CREATE TABLE `contractor_details` (
  `user_id` int NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL, -- Added address column
  `certification_pdf` text NOT NULL,
  `card_photo` text NOT NULL,
  `hourly_rate` decimal(10,2) NOT NULL,
  `job_experience` text NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create jobs table to reference users
CREATE TABLE `jobs` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `contractor_id` int NOT NULL,
  `service_type` varchar(100) DEFAULT NULL,
  `description` text,
  `location` varchar(100) DEFAULT NULL,
  `job_date` date DEFAULT NULL,
  `status` enum('pending','accepted','rejected','in_progress','completed','cancelled') DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_id`),
  FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`contractor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
