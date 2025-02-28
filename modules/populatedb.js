#! /usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const { Client } = require('pg');

const AIVEN_CA = fs.readFileSync('./aiven-db/ca.pem').toString(); // Or download manually first

const SQL = `
-- Drop tables if they exist (to avoid conflicts)
DROP TABLE IF EXISTS game_developer;
DROP TABLE IF EXISTS game_genre;
DROP TABLE IF EXISTS developers;
DROP TABLE IF EXISTS genre;
DROP TABLE IF EXISTS game;

-- Create table: game
CREATE TABLE game (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_name VARCHAR(100) NOT NULL,
    publisher VARCHAR(100) NOT NULL,
    cost DECIMAL(6,2) NOT NULL,
    year_of_release INT NOT NULL
);

-- Create table: genre
CREATE TABLE genre (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre VARCHAR(50) NOT NULL
);

-- Create table: game_genre (junction table)
CREATE TABLE game_genre (
    game_id INT REFERENCES game(id),
    genre_id INT REFERENCES genre(id),
    PRIMARY KEY (game_id, genre_id)
);

-- Create table: developers
CREATE TABLE developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    developer VARCHAR(100) NOT NULL
);

-- Create table: game_developer (junction table)
CREATE TABLE game_developer (
    game_id INT REFERENCES game(id),
    developer_id INT REFERENCES developers(id),
    PRIMARY KEY (game_id, developer_id)
);

-- Insert data into game with OVERRIDING SYSTEM VALUE
INSERT INTO game (id, game_name, publisher, cost, year_of_release) 
OVERRIDING SYSTEM VALUE VALUES
(1, 'The Witcher 3', 'CD Projekt', 59.99, 2015),
(2, 'Minecraft', 'Mojang Studios', 26.95, 2011),
(3, 'Super Mario Odyssey', 'Nintendo', 59.99, 2017),
(4, 'Elden Ring', 'Bandai Namco', 59.99, 2022),
(5, 'Fortnite', 'Epic Games', 0.00, 2017),
(6, 'Red Dead Redemption 2', 'Rockstar Games', 59.99, 2018),
(7, 'The Legend of Zelda: Breath of the Wild', 'Nintendo', 59.99, 2017),
(8, 'Cyberpunk 2077', 'CD Projekt', 59.99, 2020),
(9, 'Call of Duty: Modern Warfare', 'Activision', 59.99, 2019),
(10, 'Stardew Valley', 'ConcernedApe', 14.99, 2016),
(11, 'Grand Theft Auto V', 'Rockstar Games', 59.99, 2013),
(12, 'Hollow Knight', 'Team Cherry', 14.99, 2017),
(13, 'Overwatch', 'Blizzard Entertainment', 39.99, 2016),
(14, 'Dark Souls III', 'Bandai Namco', 59.99, 2016),
(15, 'Animal Crossing: New Horizons', 'Nintendo', 59.99, 2020),
(16, 'League of Legends', 'Riot Games', 0.00, 2009),
(17, 'God of War', 'Sony Interactive', 59.99, 2018),
(18, 'Hades', 'Supergiant Games', 24.99, 2020),
(19, 'Among Us', 'InnerSloth', 4.99, 2018),
(20, 'Sekiro: Shadows Die Twice', 'Bandai Namco', 59.99, 2019),
(21, 'Portal 2', 'Valve', 9.99, 2011),
(22, 'Apex Legends', 'Electronic Arts', 0.00, 2019),
(23, 'Skyrim', 'Bethesda Softworks', 59.99, 2011),
(24, 'Tetris', 'The Tetris Company', 4.99, 1984),
(25, 'Resident Evil Village', 'Capcom', 59.99, 2021);

-- Insert data into genre with OVERRIDING SYSTEM VALUE
INSERT INTO genre (id, genre) 
OVERRIDING SYSTEM VALUE VALUES
(1, 'RPG'),
(2, 'Sandbox'),
(3, 'Platformer'),
(4, 'Battle Royale'),
(5, 'Action-Adventure'),
(6, 'Shooter'),
(7, 'Simulation'),
(8, 'MOBA'),
(9, 'Puzzle'),
(10, 'Survival Horror');

-- Insert data into game_genre
INSERT INTO game_genre (game_id, genre_id) VALUES
(1, 1), (1, 5),
(2, 2),
(3, 3), (3, 5),
(4, 1), (4, 5),
(5, 4),
(6, 5),
(7, 5),
(8, 1), (8, 5),
(9, 6),
(10, 7),
(11, 5),
(12, 3), (12, 5),
(13, 6),
(14, 1), (14, 5),
(15, 7),
(16, 8),
(17, 5),
(18, 1),
(19, 7),
(20, 5),
(21, 9),
(22, 4),
(23, 1),
(24, 9),
(25, 10);

-- Insert data into developers with OVERRIDING SYSTEM VALUE
INSERT INTO developers (id, developer) 
OVERRIDING SYSTEM VALUE VALUES
(1, 'CD Projekt Red'),
(2, 'Mojang'),
(3, 'Nintendo EPD'),
(4, 'FromSoftware'),
(5, 'Epic Games'),
(6, 'Rockstar Games'),
(7, 'Infinity Ward'),
(8, 'ConcernedApe'),
(9, 'Team Cherry'),
(10, 'Blizzard Entertainment'),
(11, 'Riot Games'),
(12, 'Santa Monica Studio'),
(13, 'Supergiant Games'),
(14, 'InnerSloth'),
(15, 'Valve'),
(16, 'Respawn Entertainment'),
(17, 'Bethesda Game Studios'),
(18, 'Alexey Pajitnov'),
(19, 'Capcom');

-- Insert data into game_developer
INSERT INTO game_developer (game_id, developer_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 3),
(8, 1),
(9, 7),
(10, 8),
(11, 6),
(12, 9),
(13, 10),
(14, 4),
(15, 3),
(16, 11),
(17, 12),
(18, 13),
(19, 14),
(20, 4),
(21, 15),
(22, 16),
(23, 17),
(24, 18),
(25, 19);

-- Verify the data (optional)
SELECT * FROM game LIMIT 5;
SELECT * FROM genre LIMIT 5;
SELECT * FROM game_genre LIMIT 5;
SELECT * FROM developers LIMIT 5;
SELECT * FROM game_developer LIMIT 5;
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL.replace('?sslmode=require', ''),
    ssl: {
      ca: AIVEN_CA, // Use this instead of process.env.DATABASE_CA for testing
      rejectUnauthorized: true,
    },
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
