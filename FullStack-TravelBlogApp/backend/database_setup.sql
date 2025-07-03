-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS journey_plans;
DROP TABLE IF EXISTS travel_logs;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create travel_logs table
CREATE TABLE travel_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  post_date DATE NOT NULL,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create journey_plans table
CREATE TABLE journey_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  locations JSON,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  activities JSON,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert test users
INSERT INTO users (username, password, email, address) VALUES
('alex', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'alex@example.com', '123 Test Street'),
('bob', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'bob@example.com', '456 Test Avenue');

-- Insert sample travel logs for alex
INSERT INTO travel_logs (user_id, title, description, start_date, end_date, post_date, tags) VALUES
(1, 'Trip to Paris', 'Amazing experience in the city of love', '2024-01-01', '2024-01-07', '2024-01-08', '["france", "paris", "vacation"]'),
(1, 'Weekend in London', 'Quick getaway to the UK capital', '2024-02-15', '2024-02-17', '2024-02-18', '["uk", "london", "weekend"]');

-- Insert sample travel logs for bob
INSERT INTO travel_logs (user_id, title, description, start_date, end_date, post_date, tags) VALUES
(2, 'Safari in Kenya', 'Incredible wildlife experience', '2024-03-01', '2024-03-10', '2024-03-11', '["africa", "safari", "wildlife"]'),
(2, 'Beach Holiday in Bali', 'Relaxing time in paradise', '2024-04-01', '2024-04-10', '2024-04-11', '["indonesia", "beach", "relaxation"]');

-- Insert sample journey plans for alex
INSERT INTO journey_plans (user_id, name, locations, start_date, end_date, activities, description) VALUES
(1, 'Summer Europe Trip', '["rome", "venice", "florence"]', '2024-07-01', '2024-07-15', '["sightseeing", "food tour", "museum visits"]', 'Exploring the beautiful cities of Italy'),
(1, 'Winter Ski Trip', '["zermatt", "st. moritz"]', '2024-12-20', '2024-12-27', '["skiing", "snowboarding", "après-ski"]', 'Christmas skiing holiday in the Swiss Alps');

-- Insert sample journey plans for bob
INSERT INTO journey_plans (user_id, name, locations, start_date, end_date, activities, description) VALUES
(2, 'Asian Adventure', '["tokyo", "seoul", "bangkok"]', '2024-08-01', '2024-08-20', '["city tours", "temple visits", "street food"]', 'Exploring the vibrant cities of Asia'),
(2, 'Australian Road Trip', '["sydney", "melbourne", "great ocean road"]', '2024-11-01', '2024-11-15', '["driving", "beaches", "wildlife"]', 'Coastal road trip through Australia'); 