CREATE DATABASE IF NOT EXISTS `pro_connect` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pro_connect`;

-- Disable foreign key checks temporarily to drop tables
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables
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
  `address` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL, -- Optional admin-specific field
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- Create client_details table for client-specific data
CREATE TABLE `client_details` (
  `user_id` int NOT NULL,
  `fullname` varchar(150) DEFAULT NULL,
  `phone_number` varchar(150) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL, -- Added address column
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `client_details`
MODIFY `fullname` varchar(100),
MODIFY `phone_number` varchar(20);

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
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `contractor_details`
MODIFY `certification_pdf` LONGBLOB NOT NULL,
MODIFY `card_photo` varchar(255) NOT NULL;

-- Create jobs table to reference users
CREATE TABLE `job_request` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `contractor_id` int NOT NULL,
  `service_type` varchar(100) DEFAULT NULL,
  `description` text,
  `location` varchar(100) DEFAULT NULL,
  `job_date` date DEFAULT NULL,
  `status` enum('pending','accepted','rejected','in_progress','completed','cancelled') DEFAULT NULL,
  `amount` int NOT NULL,
  `hours_to_work` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_id`),
  FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`contractor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `job_request`
MODIFY `service_type` varchar(100) NOT NULL,
MODIFY `job_date` date NOT NULL;

CREATE INDEX idx_jobs_client_id ON `job_request` (`client_id`);
CREATE INDEX idx_jobs_contractor_id ON `job_request` (`contractor_id`);
CREATE INDEX idx_jobs_status ON `job_request` (`status`);

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
  PRIMARY KEY (`completed_id`),
  FOREIGN KEY (`job_id`) REFERENCES `job_request` (`job_id`) ON DELETE CASCADE,
  FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`contractor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
('admin1@proconnect.com', '$2b$12$wqQ1JjkOpVt9lixUglEj3eFlYg8StkAk0Cnk3Fw9iXQyEuFzYZsaq', 1),
('admin2@proconnect.com', '$2b$12$vn0IZP8tYvwAM/84gchI.eV93uIawV6Tzq2Km3Rcx2wn9m6yUmEwi', 1);


INSERT INTO `contractor_details` 
(`user_id`,`full_name`,`phone_number`,`address`,`certification_pdf`,`card_photo`,`hourly_rate`,`job_experience`,`description`) VALUES
(1,'Steven Jacobs','0823456789',NULL,'https://tercia2005.github.io/certificates/stevenjacobscertificate-page-001.jpg','https://media.istockphoto.com/id/487272299/photo/builder-with-spanner-isolated-on-white-background.jpg',150.50,'5 years','5 years Expert in plumbing and pipe installations'),
(2,'Njabulo Mthethwa','0834567890',NULL,'https://tercia2005.github.io/certificates/njabulomthethwacertificate-page-001.jpg','https://media.istockphoto.com/id/1369061523/photo/portrait-african-black-worker-standing-smile-isolated-on-white-background.jpg',120.00,'3 years','Skilled in electrical repairs and maintenance'),
(3,'James Petersen','0845678901',NULL,'https://tercia2005.github.io/certificates/jamespetersencertificate-page-001.jpg','https://media.istockphoto.com/id/452568163/photo/handyman-portrair.jpg',180.75,'7 years','Professional in carpentry and custom furniture'),
(4,'Samanther Daniels','0829876543',NULL,'https://tercia2005.github.io/certificates/samantherdanielscertificate-page-001.jpg','https://i.pinimg.com/736x/33/ba/1f/33ba1fb32ad57dff3439a351b5252781.jpg',145.25,'4 years','Interior design and renovation specialist'),
(5,'Frank van der Merwe','0832345678',NULL,'https://tercia2005.github.io/certificates/frankvandermerwecertificate-page-001.jpg','https://media.istockphoto.com/id/477693896/photo/manual-worker-holding-spirit-level-with-arms-crossed.jpg',200.00,'10 years','Construction project manager and builder'),
(6,'Nicole Botha','0848765432',NULL,'https://tercia2005.github.io/certificates/nicolebothacertificate-page-001.jpg','https://media.istockphoto.com/id/186851543/photo/construction-worker.jpg?s=612x612&w=0&k=20&c=j69dXivbLDpOvBxEgEh7VpehdYmjzZoVoDgHxxLzIS8=',135.50,'2 years','Painting and decorative finishes expert'),
(7,'Matthew Khumalo','0827654321',NULL,'https://tercia2005.github.io/certificates/matthewkhumalocertificate-page-001.jpg','https://media.istockphoto.com/id/487272249/photo/builder-with-trowel-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=E3htY3WPMHpLeVN_J0Fyf02qBwsE8bervoneKy42Z4g=',175.00,'6 years','Roofing and waterproofing professional'),
(8,'Travis Williams','0836789012',NULL,'https://tercia2005.github.io/certificates/traviswilliamscertificate-page-001.jpg','https://media.istockphoto.com/id/1415280832/photo/smiling-young-worker-with-an-orange-hardhat-holding-a-wrench.jpg?s=2048x2048&w=is&k=20&c=dN5MzURRXg3D__a2BI1KK_a95BHHtg1c7A0byv8hrDU=',160.25,'5 years','Landscaping and garden maintenance'),
(9,'David Naidoo','0843456789',NULL,'https://tercia2005.github.io/certificates/davidnaidoocertificate-page-001.jpg','https://media.istockphoto.com/id/2175978434/photo/engineer-in-blue-helmet-and-orange-safety-vest-smiling-with-hands-on-hips-white-background.jpg?s=2048x2048&w=is&k=20&c=LpH2xSBQwrMw4Bge061MkvJXYfabHME3upLs2EPxM80=',140.00,'3 years','Tile installation and flooring specialist'),
(10,'Rose Smith','0821234567',NULL,'https://tercia2005.github.io/certificates/rosesmithcertificate-page-001.jpg','https://media.istockphoto.com/id/516812730/photo/gardener-gardner-woman-with-flower-gardening-garden-occupation-thumbs-up.jpg?s=2048x2048&w=is&k=20&c=C0g5GH2LsOknxI1a4TNNuBv3PSu7vkQXRRIrFFmta_U=',155.75,'4 years','Event setup and decoration expert'),
(11,'Senzo Dlamini','0839123456',NULL,'https://tercia2005.github.io/certificates/senzodlaminicertificate-page-001.jpg','https://media.istockphoto.com/id/183836345/photo/african-american-construction-foreman.jpg?s=2048x2048&w=is&k=20&c=lz64Dgxu9j66dnk8Pxm6h4pcI7jdNN6Gz8k0xFNCy2c=',130.00,'2 years','Basic plumbing and handyman services'),
(12,'Joshua Adams','0846543210',NULL,'https://tercia2005.github.io/certificates/joshuadamscertificate-page-001.jpg','https://media.istockphoto.com/id/487254119/photo/builder-with-trowel-isolated-on-white-background.jpg?s=2048x2048&w=is&k=20&c=fe0r8EEh18yczlHbxP4Kss7kEIwvgk-uSlRB2ZpGlsc=',165.50,'6 years','HVAC installation and repair technician'),
(13,'Jabulani Zulu','0825678901',NULL,'https://tercia2005.github.io/certificates/jabulanizulucertificate-page-001.jpg','https://media.istockphoto.com/id/1157056523/photo/african-american-engineer-with-safety-glasses-and-safety-helmet-reaching-out-to-shake-hands.jpg?s=2048x2048&w=is&k=20&c=xb7Bf_XePPqZM6xn6_duMtypGlE1mcjWJ9jB3r9Ez0c=',150.00,'5 years','Bricklaying and masonry expert'),
(14,'Simon Nkosi','0837890123',NULL,'https://tercia2005.github.io/certificates/simonnkosicertificate-page-001.jpg','https://media.istockphoto.com/id/670472332/photo/studio-shot-of-young-happy-persian-man-construction-worker-smiling.jpg?s=2048x2048&w=is&k=20&c=XUWOhmAANEOk2WDQ5NjYktjhdTpJU717yHKkFEIhcO4=',170.25,'8 years','Metal fabrication and welding professional'),
(15,'Spencer Meyer','0848901234',NULL,'https://tercia2005.github.io/certificates/spencermeyercertificate-page-001.jpg','https://media.istockphoto.com/id/466825606/photo/repairman-with-notes.jpg?s=2048x2048&w=is&k=20&c=cpzQQAodr8bgJzXZFFSat7QSICjAvoznMPg-LlukNRs=',190.00,'9 years','Project supervision and site management');

INSERT INTO `client_details` (`user_id`, `fullname`, `phone_number`, `address`) VALUES
(16, 'Thando Mokoena', '0821112233', '45 Rose Avenue, Johannesburg, Gauteng'),
(17, 'Lerato Khumalo', '0832223344', '12 Maple Street, Pretoria, Gauteng'),
(18, 'Michael Maseko', '0843334455', '89 Pine Road, Durban, KwaZulu-Natal'),
(19, 'Karabo Sekati', '0824445566', '77 Birch Lane, Bloemfontein, Free State'),
(20, 'Peter Madonsela', '0835556677', '101 Acacia Drive, Cape Town, Western Cape');

INSERT INTO `job_request` 
(`client_id`, `contractor_id`, `service_type`, `description`, `location`, `job_date`, `status`, `amount`, `hours_to_work`)
VALUES
(16, 1, 'Plumbing', 'Fix leaking kitchen sink', '45 Rose Avenue, Johannesburg', '2025-08-20', 'pending', 250.00, 3),
(17, 2, 'Electrical', 'Install new light fixtures in living room', '12 Maple Street, Pretoria', '2025-08-22', 'accepted', 300.00, 4),
(18, 3, 'Carpentry', 'Build custom bookshelf for study', '89 Pine Road, Durban', '2025-08-25', 'in_progress', 450.50, 2),
(19, 5, 'Construction', 'Extend patio and add roof covering', '77 Birch Lane, Bloemfontein', '2025-09-01', 'completed', 1200.00, 8),
(20, 7, 'Roofing', 'Repair damaged roof tiles after storm', '101 Acacia Drive, Cape Town', '2025-08-28', 'pending', 800.00, 6),
(16, 9, 'Tiling', 'Install ceramic tiles in bathroom', '45 Rose Avenue, Johannesburg', '2025-08-24', 'accepted', 600.00, 5),
(18, 12, 'HVAC', 'Air conditioner installation in office', '89 Pine Road, Durban', '2025-09-05', 'pending', 950.00, 4.30),
(17, 14, 'Metalwork', 'Fabricate custom gate for driveway', '12 Maple Street, Pretoria', '2025-08-30', 'in_progress', 700.00, 5),
(19, 8, 'Landscaping', 'Design and plant front garden', '77 Birch Lane, Bloemfontein', '2025-09-02', 'pending', 500.00, 3.30),
(20, 15, 'Project Management', 'Oversee warehouse renovation', '101 Acacia Drive, Cape Town', '2025-09-10', 'pending', 1500.00, 5.30);

-- passwords 
-- admin1@proconnect.com -> Admin@123
-- admin1@proconnect.com -> Admin@456
-- Insert admin_details for them
INSERT INTO `admin_details` (`user_id`, `address`, `email`) VALUES
((SELECT user_id FROM users WHERE email = 'admin1@proconnect.com'), '100 Admin Street, Johannesburg, Gauteng', 'admin1@proconnect.com'),
((SELECT user_id FROM users WHERE email = 'admin2@proconnect.com'), '200 Admin Avenue, Cape Town, Western Cape', 'admin2@proconnect.com');

-- Fix trigger so it matches admin_details column names
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