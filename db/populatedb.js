#! /usr/bin/env node

require("dotenv").config();
const { Client } = require("pg");

// The SQL to create the two tables: disciplines and courses
const createTables = `
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS discipline;

-- Disciplines (Categories) Table
CREATE TABLE disciplines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
);

--Courses (Items) Table 
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    discipline_id INTEGER REFERENCES disciplines(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    main_content TEXT,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 10),
    rewards INTEGER CHECK (rewards >= 1 AND rewards <= 10),
    rating NUMERIC(2, 1),
    stock_quantity INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP
)
`;

//Initial Data Seeding
const seedData = `
    INSERT INTO disciplines (name, description) VALUES
    ('Power Systems Engineer', 'Focuses on generation, transmission, and distribution.'),
    ('Embedded Systems Engineer', 'Focuses on microcontrollers and real-time computing.');

    -- Get discipline IDs to link courses correctly
    -- We assume the IDs are 1 and 2 for now, or use subqueries for robustness
    INSERT INTO courses (discipline_id, name, description, difficulty, rewards, stock_quantity) VALUES
    (1, 'Power Systems I', 'Fundamentals of AC power.', 5, 7, 50),
    (1, 'Electrical Machines', 'Study of motors and generators.', 8, 9, 30),
    (2, 'Microprocessors', 'Introduction to CPU architecture and programming.', 7, 8, 45),
    (2, 'C++', 'Object-Oriented Programming for low-level control.', 6, 7, 60);
`;

async function setupDatabase() {
  console.log("--- Setting up Database ---");
  // Use Client for one-off tasks like setup
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    await client.connect();
    await client.query(createTables);
    console.log("Tables created successfully.");
    await client.query(seedData);
    console.log("Database seeded with initial data.");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await client.end(); // Properly ends the 'client' connection
    console.log("Database setup complete.");
  }
}

setupDatabase();
