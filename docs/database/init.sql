-- Initial database setup for Eerie API
-- This script creates the database and sets up basic configuration

-- Create database (run this as postgres superuser)
CREATE DATABASE eerie_api;

-- Connect to the database
\c eerie_api;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a dedicated user for the application (optional but recommended)
-- CREATE USER eerie_api_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE eerie_api TO eerie_api_user;
