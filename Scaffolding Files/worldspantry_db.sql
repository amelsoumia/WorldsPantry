-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 30, 2022 at 09:54 AM
-- Server version: 8.0.24
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `worldspantry_db`
--

CREATE DATABASE IF NOT EXISTS worldspantry_db;
USE worldspantry_db;

-- =========================
-- USER TABLE
-- =========================
CREATE TABLE `user` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    join_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PHOTO
-- =========================
CREATE TABLE photo (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    url TEXT NOT NULL
);

-- =========================
-- COUNTRY CATEGORY
-- =========================
CREATE TABLE country_category (
    country_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================
-- DIETARY CATEGORY
-- =========================
CREATE TABLE dietary_category (
    dietary_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================
-- USER PROFILE
-- =========================
CREATE TABLE user_profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    photo_id INT,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photo(photo_id) ON DELETE SET NULL
);

-- =========================
-- DIETARY PREFERENCE TABLE
-- =========================
CREATE TABLE dietary_preference (
    user_id INT NOT NULL,
    dietary_id INT NOT NULL,
    PRIMARY KEY (user_id, dietary_id),
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (dietary_id) REFERENCES dietary_category(dietary_id) ON DELETE CASCADE
);

-- =========================
-- COUNTRY PREFERENCE TABLE
-- =========================
CREATE TABLE country_preference (
    user_id INT NOT NULL,
    country_id INT NOT NULL,
    PRIMARY KEY (user_id, country_id),
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES country_category(country_id) ON DELETE CASCADE
);

-- =========================
-- RECIPE
-- =========================
CREATE TABLE recipe (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    ingredient_list TEXT,
    description TEXT,
    instructions TEXT,
    country_id INT,
    image TEXT,
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES country_category(country_id) ON DELETE SET NULL
);

-- =========================
-- RECIPE DIETARY TAGS
-- =========================
CREATE TABLE recipe_dietary_tags (
    recipe_id INT NOT NULL,
    dietary_id INT NOT NULL,
    PRIMARY KEY (recipe_id, dietary_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (dietary_id) REFERENCES dietary_category(dietary_id) ON DELETE CASCADE
);

-- =========================
-- RECIPE PHOTO
-- =========================
CREATE TABLE recipephoto (
    recipe_id INT NOT NULL,
    photo_id INT NOT NULL,
    PRIMARY KEY (recipe_id, photo_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photo(photo_id) ON DELETE CASCADE
);

-- =========================
-- LIKE
-- =========================
CREATE TABLE `like` (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE
);

-- =========================
-- SAVE
-- =========================
CREATE TABLE save (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE
);

-- =========================
-- REVIEW
-- =========================
CREATE TABLE review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    UNIQUE (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE
);



-- ========================
-- INPUTS
-- ========================
INSERT INTO country_category (name) VALUES ('Italian');
INSERT INTO `user` (username, password_hash) VALUES ('jamie_cooks', 'hashedpassword123');
INSERT INTO recipe (user_id, title, ingredient_list, description, country_id, instructions) 
VALUES (1, 'Spaghetti Carbonara', 
'400g spaghetti, 200g guanciale, 4 eggs, 100g Pecorino Romano, black pepper, salt',
'A classic Roman pasta dish made with eggs, cheese, and guanciale. Rich, creamy and ready in 30 minutes.',
1, 'Spagetti_carbonara.jpg', 'Step 1: Boil water and cook pasta, Step 2: Fry guanciale until crispy, Step 3: Mix eggs and cheese, Step 4: Combine and serve');

INSERT INTO recipe (user_id, title, ingredient_list, description, country_id, instructions) 
VALUES (1, 'Chicken Shawarma', 
'500g chicken thighs, 3 tbsp yogurt, 2 tbsp lemon juice, 3 garlic cloves, 2 tsp cumin, 2 tsp paprika, 1 tsp turmeric, salt, pepper, pita bread',
'A flavorful Middle Eastern street food made with marinated chicken, grilled and served in warm pita bread.',
2, 'Step 1: Marinate chicken with spices and yogurt, Step 2: Let it rest for at least 1 hour, Step 3: Cook chicken in pan or grill, Step 4: Slice and serve in pita');

INSERT INTO recipe (user_id, title, ingredient_list, description, country_id, instructions) 
VALUES (1, 'Chicken Tikka Masala', 
'500g chicken breast, 200ml yogurt, 2 tbsp garam masala, 1 onion, 3 garlic cloves, 1 tbsp ginger, 400g tomato sauce, 100ml cream, salt',
'A popular Indian curry featuring grilled chicken pieces in a creamy, spiced tomato sauce.',
3, 'Step 1: Marinate chicken in yogurt and spices, Step 2: Cook chicken until slightly charred, Step 3: Prepare sauce with onion, garlic, and tomato, Step 4: Add chicken and cream, simmer and serve');

-- Chicken Shawarma → Halal + Dairy-Free (multiple tags)
INSERT INTO recipe_dietary_tags (recipe_id, dietary_id) VALUES
(2, 1), -- Halal
(2, 5); -- Dairy-Free


-- Chicken Tikka Masala → Halal
INSERT INTO recipe_dietary_tags (recipe_id, dietary_id) VALUES
(3, 1);


-- Spaghetti Carbonara → Nut-Free
INSERT INTO recipe_dietary_tags (recipe_id, dietary_id) VALUES
(1, 6);