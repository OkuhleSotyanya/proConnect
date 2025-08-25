-- pro_connect.sql
CREATE DATABASE IF NOT EXISTS `pro_connect` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pro_connect`;

-- Disable foreign key checks temporarily to drop tables
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables (unchanged)
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `contractors`;
DROP TABLE IF EXISTS `job_request`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`; 
DROP TABLE IF EXISTS `admin_details`;
DROP TABLE IF EXISTS `client_details`;
DROP TABLE IF EXISTS `contractor_details`;
DROP TABLE IF EXISTS `job_completed`;

-- Create roles table (unchanged)
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert default roles (unchanged)
INSERT INTO `roles` (`role_name`, `description`) VALUES
('admin', 'System administrator with full access'),
('client', 'Client who can request jobs'),
('contractor', 'Contractor who can accept and perform jobs');

-- Create users table (unchanged)
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

-- Create admin_details table (unchanged)
CREATE TABLE `admin_details` (
  `user_id` int NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create client_details table (unchanged)
CREATE TABLE `client_details` (
  `user_id` int NOT NULL,
  `fullname` varchar(100),
  `phone_number` varchar(20),
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create contractor_details table (unchanged)
CREATE TABLE `contractor_details` (
  `user_id` int NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `certification_pdf` LONGBLOB NOT NULL,
  `card_photo` varchar(255) NOT NULL,
  `hourly_rate` decimal(10,2) NOT NULL,
  `job_experience` text NOT NULL,
  `description` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create job_request table (updated: status ENUM includes 'denied', amount is DECIMAL)
CREATE TABLE `job_request` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `contractor_id` int NOT NULL,
  `service_type` varchar(100) NOT NULL,
  `description` text,
  `location` varchar(100) DEFAULT NULL,
  `job_date` date NOT NULL,
  `status` enum('request','pending','completed','denied') DEFAULT 'request',
  `amount` decimal(10,2) NOT NULL,
  `hours_to_work` int NOT NULL,
  `invoice_status` enum('PAID') DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  PRIMARY KEY (`job_id`),
  KEY `idx_jobs_client_id` (`client_id`),
  KEY `idx_jobs_contractor_id` (`contractor_id`),
  KEY `idx_jobs_status` (`status`),
  CONSTRAINT `job_request_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `job_request_ibfk_2` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create job_completed table (unchanged)
CREATE TABLE `job_completed` (
  `completed_id` INT NOT NULL AUTO_INCREMENT,
  `job_id` INT NOT NULL,
  `client_id` INT NOT NULL,
  `contractor_id` INT NOT NULL,
  `service_type` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `location` VARCHAR(100) DEFAULT NULL,
  `job_date` DATE NOT NULL,
  `rating` DECIMAL(3,2) DEFAULT NULL,
  `review` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL,
  `restored_at` DATETIME NULL,
  `restored_by_admin_id` INT NULL,
  PRIMARY KEY (`completed_id`),
  FOREIGN KEY (`job_id`) REFERENCES `job_request` (`job_id`) ON DELETE CASCADE,
  FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`contractor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`restored_by_admin_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  INDEX `idx_job_completed_job_id` (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert users (updated: add client_id = 21)
INSERT INTO `users` (`email`, `password_hash`, `role_id`) VALUES
('steven.jacobs@gmail.com', '$2b$12$XoTwB1QcvyOrDbmKm8bln.qDSNmaWreL9Ei1sfPzjrsbiky/d.JNq', 3),
('njabulo.mthethwa@gmail.com', '$2b$12$Nt5YdVcCZHO3eRyvejO6ruIifBB2WxsYU7f0LlUysiEfekSmUFL0W', 3),
('james.petersen@gmail.com', '$2b$12$/t9XK2.zS/2XTJoXdbP6hubmYGvtLtQ7UwAT27PcuiL9Ojr18jSRu', 3),
('samanther.daniels@gmail.com', '$2b$12$0Nc.K0zKDnopXyZdQ5vmw.liB/7u.GwZNxG6mazrRla1gHQdc0gAO', 3),
('frank.vdmerwe@gmail.com', '$2b$12$MsrvBiEJh8l2eATTTPu0D.l0KVZ3aaN2qiOrl3YjhxuLkPolmNKkC', 3),
('nicole.botha@gmail.com', '$2b$12$DVzNSjlKn2RG/t14tQJF5.9sOlZPIR4T7tSibsZctMCFjPBWARQ66', 3),
('matthew.khumalo@gmail.com', '$2b$12$WNkJmrtbW.FU256tQKZWYeZv72XCxWAtEVVfdqMRYBhPuM2BUvAw6', 3),
('travis.williams@gmail.com', '$2b$12$xISHJeum436K4Lrg8Ae8Ped2g2/TL6G7c1mDmq38jxHBg75vaQaNW', 3),
('david.naidoo@gmail.com', '$2b$12$ctnNZ8AzrjOoKaQ82KbmTO2Y3OLQioCqk3qw45GGCRvYCiBtbaLuq', 3),
('rose.smith@gmail.com', '$2b$12$gkt3Drjq8khhIJhMSY/hV.myXzXXGQzHfFTPyfiCJTXqBMuibX44W', 3),
('senzo.dlamini@gmail.com', '$2b$12$Y9X4i7P9EPtdoFYZ4IA0EuOhB7.aVpIT5oMi.pnaVKqAlUsMFxkEW', 3),
('joshua.adams@gmail.com', '$2b$12$xtwgE2Gb/3YlD16I/WLEBO9iIVo9iG9MaAhj/04XwLp56O1sZTxKS', 3),
('jabulani.zulu@gmail.com', '$2b$12$j3GLgZVSN6nqMexqVKPMEezMQsln9UYTOMyRkjKd86HOQ9QcncBju', 3),
('simon.nkosi@gmail.com', '$2b$12$jAAZBiz4KmqimepQj9ou6ez0Rp2VYoTEikfPiCH6JkfaK5bVn4hs', 3),
('spencer.meyer@gmail.com', '$2b$12$ICR23C/un7fe4eYD7dG5BuvxCcg.ThB4a.aw7gTb/dHm9W.p0BnRK', 3),
('thando.mokoena@gmail.com', '$2b$12$gF9kX0rGfA4oRvI1T2mS0e7iWZpO6P/ZxY7J4T3h8g3R6LqLOyDfa', 2),
('lerato.khumalo@gmail.com', '$2b$12$gF9kX0rGfA4oRvI1T2mS0e7iWZpO6P/ZxY7J4T3h8g3R6LqLOyDfa', 2),
('michael.maseko@gmail.com', '$2b$12$gF9kX0rGfA4oRvI1T2mS0e7iWZpO6P/ZxY7J4T3h8g3R6LqLOyDfa', 2),
('karabo.sekati@gmail.com', '$2b$12$gF9kX0rGfA4oRvI1T2mS0e7iWZpO6P/ZxY7J4T3h8g3R6LqLOyDfa', 2),
('peter.madonsela@gmail.com', '$2b$12$gF9kX0rGfA4oRvI1T2mS0e7iWZpO6P/ZxY7J4T3h8g3R6LqLOyDfa', 2),
('test.client@gmail.com', '$2b$12$gF9kX0rGfA4oRvI1T2mS0e7iWZpO6P/ZxY7J4T3h8g3R6LqLOyDfa', 2);

-- Insert client_details (updated: add client_id = 21)
INSERT INTO `client_details` (`user_id`, `fullname`, `phone_number`, `address`) VALUES
(16, 'Thando Mokoena', '0821112233', '45 Rose Avenue, Johannesburg, Gauteng'),
(17, 'Lerato Khumalo', '0832223344', '12 Maple Street, Pretoria, Gauteng'),
(18, 'Michael Maseko', '0843334455', '89 Pine Road, Durban, KwaZulu-Natal'),
(19, 'Karabo Sekati', '0824445566', '77 Birch Lane, Bloemfontein, Free State'),
(20, 'Peter Madonsela', '0835556677', '101 Acacia Drive, Cape Town, Western Cape'),
(21, 'Test Client', '0826667788', '123 Test Street, Cape Town, Western Cape');

-- Insert contractor_details (unchanged)
INSERT INTO `contractor_details` 
(`user_id`,`full_name`,`phone_number`,`address`,`certification_pdf`,`card_photo`,`hourly_rate`,`job_experience`,`description`) VALUES
(1,'Steven Jacobs','0823456789','123 Avenue Street',X'','https://i.pinimg.com/736x/c1/9e/8c/c19e8c264bdb02463f66c04e3bf97204.jpg',145.45,'5 years','Skilled in Plumbing and electrical shooks'),
(2,'Njabulo Mthethwa','0834567890','10 Walworth Road',X'','https://i.pinimg.com/1200x/95/6e/dd/956eddba046af9e7ecd3c37c1bd6d5a6.jpg',120.00,'3 years','Skilled in electrical repairs and maintenance'),
(3,'James Petersen','0845678901','11 Goodwood Street',X'','https://i.pinimg.com/736x/1f/e7/33/1fe7331a7ea022bc0cfe5fea3ee32069.jpg',180.75,'7 years','Professional in carpentry and custom furniture'),
(4,'Samanther Daniels','0829876543','Lake 10 Busher',X'','https://i.pinimg.com/1200x/93/57/6d/93576dafd0a094ad8d2a2858bef7fb90.jpg',145.25,'4 years','Interior design and renovation specialist'),
(5,'Frank van der Merwe','0832345678','234 Civic Center',X'','https://i.pinimg.com/1200x/5e/7b/40/5e7b40297cadbedeff54a01c25e1d6c3.jpg',200.00,'10 years','Construction project manager and builder'),
(6,'Nicole Botha','0848765432','890 Khayelitsha',X'','https://i.pinimg.com/736x/e7/26/f0/e726f0300d266a7a5c4fdd6eafab6f11.jpg',135.50,'2 years','Painting and decorative finishes expert'),
(7,'Matthew Khumalo','0827654321','123 Parklands Main North',X'','https://i.pinimg.com/736x/9d/db/4e/9ddb4e4003af284f07adf708d19783fd.jpg',175.00,'6 years','Roofing and waterproofing professional'),
(8,'Travis Williams','0836789012','56 Fourth Avenue Street',X'','https://i.pinimg.com/736x/86/58/97/8658971eff508d3e91bb619a8218c0d2.jpg',160.25,'5 years','Landscaping and garden maintenance'),
(9,'David Naidoo','0843456789','9 Lincoln street',X'','https://i.pinimg.com/1200x/6e/63/93/6e639309715d15098a071c3c1476621d.jpg',140.00,'3 years','Tile installation and flooring specialist'),
(10,'Rose Smith','0821234567','89 Long Street',X'','https://i.pinimg.com/736x/ec/ad/a1/ecada111c76e1e6d22c0d4fbbd85462f.jpg',155.75,'4 years','Event setup and decoration expert'),
(11,'Senzo Dlamini','0839123456','5th Blaubergside road',X'','https://media.istockphoto.com/id/183836345/photo/african-american-construction-foreman.jpg?s=2048x2048&w=is&k=20&c=lz64Dgxu9j66dnk8Pxm6h4pcI7jdNN6Gz8k0xFNCy2c=',130.00,'2 years','Basic plumbing and handyman services'),
(12,'Joshua Adams','0846543210','Revenue Built',X'','https://media.istockphoto.com/id/487254119/photo/builder-with-trowel-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=fe0r8EEh18yczlHbxP4Kss7kEIwvgk-uSlRB2ZpGlsc=',165.50,'6 years','HVAC installation and repair technician'),
(13,'Jabulani Zulu','0825678901','Hazel Street 4th',X'','https://media.istockphoto.com/id/1157056523/photo/african-american-engineer-with-safety-glasses-and-safety-helmet-reaching-out-to-shake-hands.jpg?s=2048x2048&w=is&k=20&c=xb7Bf_XePPqZM6xn6_duMtypGlE1mcjWJ9jB3r9Ez0c=',150.00,'5 years','Bricklaying and masonry expert'),
(14,'Simon Nkosi','0837890123','7 Dunoon',X'','https://media.istockphoto.com/id/670472332/photo/studio-shot-of-young-happy-persian-man-construction-worker-smiling.jpg?s=2048x2048&w=is&k=20&c=XUWOhmAANEOk2WDQ5NjYktjhdTpJU717yHKkFEIhcO4=',170.25,'8 years','Metal fabrication and welding professional'),
(15,'Spencer Meyer','0848901234','Mfuleni, Zwezwe street',X'','https://media.istockphoto.com/id/466825606/photo/repairman-with-notes.jpg?s=2048x2048&w=is&k=20&c=cpzQQAodr8bgJzXZFFSat7QSICjAvoznMPg-LlukNRs=',190.00,'9 years','Project supervision and site management');

-- Insert job_request (updated: use DECIMAL for amount)
LOCK TABLES `job_request` WRITE;
INSERT INTO `job_request` VALUES 
(1,16,1,'Plumbing','Fix leaking kitchen sink','45 Rose Avenue, Johannesburg','2025-08-20','pending',406.00,3,'PAID','2025-08-18'),
(2,17,2,'Electrical','Install new light fixtures in living room','12 Maple Street, Pretoria','2025-08-22','pending',300.00,4,'PAID','2025-08-20'),
(3,18,3,'Carpentry','Build custom bookshelf for study','89 Pine Road, Durban','2025-08-25','request',451.00,2,'PAID','2025-08-24'),
(4,19,5,'Construction','Extend patio and add roof covering','77 Birch Lane, Bloemfontein','2025-09-01','pending',1200.00,8,'PAID','2025-09-01'),
(7,18,12,'HVAC','Air conditioner installation in office','89 Pine Road, Durban','2025-09-05','request',950.00,4,'PAID','2025-09-03'),
(8,17,14,'Metalwork','Fabricate custom gate for driveway','12 Maple Street, Pretoria','2025-08-30','request',700.00,5,'PAID','2025-08-28'),
(9,19,8,'Landscaping','Design and plant front garden','77 Birch Lane, Bloemfontein','2025-09-02','pending',500.00,3,'PAID','2025-09-01'),
(10,20,15,'Project Management','Oversee warehouse renovation','101 Acacia Drive, Cape Town','2025-09-10','pending',1500.00,5,'PAID','2025-09-08');
UNLOCK TABLES;

-- Trigger (unchanged)
DROP TRIGGER IF EXISTS after_user_insert;
DELIMITER $$
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.role_id = 1 THEN
        INSERT INTO admin_details (user_id, address, email)
        VALUES (NEW.user_id, '', NEW.email);
    ELSEIF NEW.role_id = 2 THEN
        INSERT INTO client_details (user_id, fullname, phone_number, address)
        VALUES (NEW.user_id, NULL, NULL, NULL);
    ELSEIF NEW.role_id = 3 THEN
        INSERT INTO contractor_details (user_id, full_name, phone_number, address, certification_pdf, card_photo, hourly_rate, job_experience, description)
        VALUES (NEW.user_id, '', NULL, NULL, '', '', 0.00, '', '');
    END IF;
END$$
DELIMITER ;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;