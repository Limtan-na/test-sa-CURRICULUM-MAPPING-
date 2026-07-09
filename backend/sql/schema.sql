CREATE DATABASE IF NOT EXISTS cqi_monitoring_system
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE cqi_monitoring_system;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'manager', 'user') NOT NULL DEFAULT 'user',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  program_id INT NOT NULL,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(200) NOT NULL,
  credits INT NOT NULL DEFAULT 3,
  year_level TINYINT NOT NULL DEFAULT 1,
  semester TINYINT NOT NULL DEFAULT 1,
  description TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_course_in_program (program_id, code)
);

CREATE TABLE outcomes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('peo', 'po', 'clo') NOT NULL,
  code VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  program_id INT DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_outcome_code (type, code, program_id)
);

CREATE TABLE mappings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  outcome_id INT NOT NULL,
  coverage_level ENUM('I', 'E', 'D') NOT NULL DEFAULT 'I',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (outcome_id) REFERENCES outcomes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_mapping (course_id, outcome_id)
);

INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES
  ('admin', 'admin@nbsc.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System', 'Admin', 'admin'),
  ('manager', 'manager@nbsc.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Department', 'Manager', 'manager'),
  ('user1', 'user1@nbsc.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'User', 'One', 'user');

INSERT INTO programs (code, name, description) VALUES
  ('BSIT', 'Bachelor of Science in Information Technology', 'A four-year program focused on IT fundamentals, programming, networking, and database management.');

INSERT INTO courses (program_id, code, name, credits, year_level, semester, description) VALUES
  (1, 'IT 10', 'Introduction to Computing', 3, 1, 1, 'Fundamentals of computing, history, and basic concepts.'),
  (1, 'IT 11', 'Fundamentals of Programming 1', 3, 1, 1, 'Structured programming using a modern language.'),
  (1, 'MATH 21', 'Discrete Mathematics', 3, 1, 1, 'Mathematical structures for computing and logic.'),
  (1, 'IT 12', 'Human Computer Interaction', 3, 1, 2, 'Principles of user interface design and usability.'),
  (1, 'IT 13', 'Fundamentals of Programming 2', 3, 1, 2, 'Object-oriented programming concepts and design.'),
  (1, 'IT 14', 'Quantitative Methods', 3, 1, 2, 'Statistical and mathematical methods for IT.'),
  (1, 'IT 15', 'Platform Technologies', 3, 1, 2, 'Overview of computing platforms and architectures.'),

  (1, 'IT 20', 'Data Structures and Algorithm', 3, 2, 1, 'Linear and non-linear data structures, sorting, searching.'),
  (1, 'IT 21', 'Object Oriented Programming', 3, 2, 1, 'Advanced OOP concepts and design patterns.'),
  (1, 'IT 22', 'Fundamentals of Networking', 3, 2, 1, 'Network models, protocols, and basic configuration.'),
  (1, 'IT 23', 'Web System and Technologies', 3, 2, 1, 'Client-side and server-side web development.'),
  (1, 'IT 24', 'Event Driven Programming', 3, 2, 1, 'GUI applications and event-driven development.'),
  (1, 'IT 25', 'Multimedia Systems Development', 3, 2, 1, 'Multimedia authoring and interactive media.'),
  (1, 'IT 26', 'Fundamentals of Database Systems', 3, 2, 2, 'Relational database design, SQL, and normalization.'),
  (1, 'IT 27', 'Information Management', 3, 2, 2, 'Data management, administration, and security.'),
  (1, 'IT 28', 'E-Commerce', 3, 2, 2, 'E-business models, online transactions, and security.'),
  (1, 'IT 29', 'Advance Networking', 3, 2, 2, 'Routing, switching, and network infrastructure.'),
  (1, 'CCS 6', 'Indigenous Creative Crafts', 3, 2, 2, 'Indigenous materials and creative craft production.'),

  (1, 'IT 30', 'Advance Database System', 3, 3, 1, 'Distributed databases, NoSQL, and advanced queries.'),
  (1, 'IT 31', 'Professional Ethics', 3, 3, 1, 'Legal, ethical, and professional issues in IT.'),
  (1, 'IT 32', 'System Integration & Architecture 1', 3, 3, 1, 'Enterprise architecture and system integration.'),
  (1, 'IT 33', 'Data Mining', 3, 3, 1, 'Data mining algorithms, patterns, and analytics.'),
  (1, 'IT 34', 'Information Assurance & Security 1', 3, 3, 1, 'Security principles, cryptography, and risk management.'),
  (1, 'CCS 5', 'Living in the IT Era', 3, 3, 1, 'IT impacts on society, ethics, and digital citizenship.'),
  (1, 'IT 35', 'Application Dev. & Emerging Technologies', 3, 3, 2, 'Mobile, cloud, and emerging platform development.'),
  (1, 'IT 36', 'Information Assurance & Security 2', 3, 3, 2, 'Advanced security, forensics, and compliance.'),
  (1, 'IT 37', 'Hardware Implementation Technologies', 3, 3, 2, 'Hardware architecture, IoT, and embedded systems.'),
  (1, 'IT 38', 'Enterprise Systems', 3, 3, 2, 'ERP, CRM, and enterprise application integration.'),
  (1, 'IT 39', 'System Integration & Architecture 2', 3, 3, 2, 'Advanced integration, APIs, and microservices.'),
  (1, 'MATH 31N', 'Probability and Statistics for IT Research', 3, 3, 3, 'Statistical methods and probability for IT research.'),
  (1, 'IT 40', 'Capstone Project 1', 3, 3, 3, 'Project proposal, research methodology, and system design.'),

  (1, 'IT 41', 'Capstone Project 2', 3, 4, 1, 'Project implementation, testing, and defense.'),
  (1, 'IT 42', 'Trends in Computer Technology & Field Trip', 3, 4, 1, 'Emerging technologies and industry exposure.'),
  (1, 'IT 43', 'System Administration & Maintenance', 3, 4, 1, 'Server administration, deployment, and maintenance.'),
  (1, 'IT 44', 'On-Job-Training', 6, 4, 2, '486 hours of industry practicum.');

INSERT INTO outcomes (type, code, description, program_id) VALUES
  ('po', 'PO1', 'Apply knowledge of computing, science, and mathematics to solve IT problems.', 1),
  ('po', 'PO2', 'Design and implement computing solutions using appropriate tools and techniques.', 1),
  ('po', 'PO3', 'Function effectively as an individual and as part of a diverse team.', 1),
  ('po', 'PO4', 'Communicate effectively with stakeholders in oral and written forms.', 1),
  ('po', 'PO5', 'Recognize professional, ethical, and legal responsibilities in computing practice.', 1),
  ('po', 'PO6', 'Engage in continuous professional development and lifelong learning.', 1);

INSERT INTO mappings (course_id, outcome_id, coverage_level) VALUES
  -- Y1S1
  (1, 1, 'I'), (1, 3, 'I'), (2, 1, 'I'), (2, 2, 'I'), (3, 1, 'I'),
  -- Y1S2
  (4, 4, 'I'), (5, 2, 'E'), (5, 3, 'I'), (6, 1, 'E'), (7, 1, 'I'), (7, 6, 'I'),
  -- Y2S1
  (8, 1, 'E'), (9, 2, 'E'), (10, 6, 'I'), (11, 2, 'I'), (11, 4, 'I'), (12, 2, 'E'), (13, 3, 'I'), (13, 6, 'I'),
  -- Y2S2
  (14, 1, 'E'), (15, 1, 'E'), (16, 5, 'I'), (16, 6, 'I'), (17, 6, 'E'), (18, 3, 'I'), (18, 6, 'I'),
  -- Y3S1
  (19, 1, 'D'), (20, 5, 'E'), (21, 2, 'D'), (21, 4, 'E'), (22, 1, 'D'), (23, 5, 'E'), (23, 6, 'E'), (24, 5, 'I'), (24, 6, 'I'),
  -- Y3S2
  (25, 2, 'D'), (25, 6, 'E'), (26, 5, 'D'), (27, 6, 'I'), (28, 2, 'D'), (28, 4, 'D'),
  -- Y3 Summer
  (30, 1, 'E'), (31, 1, 'D'), (31, 4, 'E'),
  -- Y4S1
  (32, 2, 'D'), (32, 4, 'D'), (33, 6, 'D'), (34, 3, 'D'), (34, 4, 'E'),
  -- Y4S2
  (35, 3, 'D'), (35, 5, 'D'), (35, 6, 'D');
