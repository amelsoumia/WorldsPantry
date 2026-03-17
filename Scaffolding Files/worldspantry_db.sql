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
-- USER
-- =========================
CREATE TABLE `user` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- =========================
-- PREFERENCES
-- =========================
CREATE TABLE preferences (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

-- =========================
-- USER_PREFERENCE
-- =========================
CREATE TABLE user_preference (
    user_id INT NOT NULL,
    preference_id INT NOT NULL,
    PRIMARY KEY (user_id, preference_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (preference_id) REFERENCES preferences(preference_id) ON DELETE CASCADE
);

-- =========================
-- PHOTO
-- =========================
CREATE TABLE photo (
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    url TEXT NOT NULL
);

-- =========================
-- USER PROFILE
-- =========================
CREATE TABLE user_profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    photo_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photo(photo_id) ON DELETE SET NULL
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
-- RECIPE
-- =========================
CREATE TABLE recipe (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    ingredient_list TEXT,
    description TEXT,
    country_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
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
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE
);

-- =========================
-- SAVE
-- =========================
CREATE TABLE save (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
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
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE
);

