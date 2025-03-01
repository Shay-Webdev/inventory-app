const pool = require('./pool');

const getGames = async () => {
  const { rows } = await pool.query('SELECT * FROM game');
  return rows;
};

const getCategories = async () => {
  const { rows } = await pool.query('SELECT * FROM genre');
  // console.log(`All Categories: `, rows);

  return rows;
};

const getGamesByCategory = async (genre) => {
  const { rows } = await pool.query(
    'SELECT * FROM game JOIN game_genre ON game.id = game_genre.game_id JOIN genre ON game_genre.genre_id = genre.id  WHERE genre = $1',
    [genre]
  );
  // console.log(`All Games of of genre ${genre}: `, rows);

  return rows;
};

const getGameDetail = async (id) => {
  const { rows } = await pool.query(
    `SELECT  g.id, g.game_name, g.publisher, g.cost, g.year_of_release, STRING_AGG(gen.genre, ', ') AS genres FROM game g JOIN game_genre gg ON g.id = gg.game_id JOIN genre gen ON gg.genre_id = gen.id WHERE g.id = $1 GROUP BY g.id, g.game_name, g.publisher, g.cost, g.year_of_release;`,
    [id]
  );
  console.log(`Game Detail: `, rows[0]);

  return rows[0];
};

const searchGames = async (searchTerm) => {
  const { rows } = await pool.query(
    'SELECT * FROM game WHERE game_name ILIKE $1',
    [`%${searchTerm}%`]
  );
  return rows;
};

async function updateGameAndGenres(
  gameId,
  gameName,
  cost,
  genreIdsToAdd,
  genreIdsToRemove,
  release_year,
  publisher
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const gameQuery = `
      UPDATE game
      SET game_name = $1, cost = $2, year_of_release = $3, publisher = $4
      WHERE id = $5
      RETURNING *;
    `;
    const gameValues = [gameName, cost, release_year, publisher, gameId];
    const gameResult = await client.query(gameQuery, gameValues);

    if (genreIdsToRemove && genreIdsToRemove.length > 0) {
      const removeQuery = `
        DELETE FROM game_genre
        WHERE game_id = $1 AND genre_id = ANY($2::int[])
      `;
      await client.query(removeQuery, [gameId, genreIdsToRemove]);
    }

    if (genreIdsToAdd && genreIdsToAdd.length > 0) {
      const addQuery = `
        INSERT INTO game_genre (game_id, genre_id)
        SELECT $1, unnest($2::int[])
        ON CONFLICT DO NOTHING
      `;
      await client.query(addQuery, [gameId, genreIdsToAdd]);
    }

    await client.query('COMMIT');
    return gameResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
async function addNewGenre(genreName) {
  const query = `
    INSERT INTO genre (genre)
    VALUES ($1)
    ON CONFLICT DO NOTHING
    RETURNING id;
  `;
  const result = await pool.query(query, [genreName]);
  return result.rows[0]?.id; // Returns new genre ID or undefined if exists
}

async function addNewGame(gameName, cost, release_year, publisher, genreIds) {
  const query = `
    INSERT INTO game (game_name, cost, year_of_release, publisher)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;
  const result = await pool.query(query, [
    gameName,
    cost,
    release_year,
    publisher,
  ]);
  const gameId = result.rows[0]?.id; // Returns new game ID or undefined if exists
  if (gameId) {
    const insertQuery = `
      INSERT INTO game_genre (game_id, genre_id)
      SELECT $1, unnest($2::int[])
    `;
    await pool.query(insertQuery, [gameId, genreIds]);
  }
  return gameId;
}

// In queries.js
async function addGameAndGenres(
  gameName,
  publisher,
  cost,
  yearOfRelease,
  genreIdsToAdd
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert game
    const gameQuery = `
      INSERT INTO game (game_name, publisher, cost, year_of_release)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const gameResult = await client.query(gameQuery, [
      gameName,
      publisher,
      cost,
      yearOfRelease,
    ]);
    const gameId = gameResult.rows[0].id;

    // Add genres if provided
    if (genreIdsToAdd && genreIdsToAdd.length > 0) {
      const addGenresQuery = `
        INSERT INTO game_genre (game_id, genre_id)
        SELECT $1, unnest($2::int[])
        ON CONFLICT DO NOTHING;
      `;
      await client.query(addGenresQuery, [gameId, genreIdsToAdd]);
    }

    // Fetch full game details with genres
    const detailQuery = `
      SELECT g.id, g.game_name, g.publisher, g.cost, g.year_of_release, 
             STRING_AGG(gen.genre, ', ') AS genres 
      FROM game g 
      LEFT JOIN game_genre gg ON g.id = gg.game_id 
      LEFT JOIN genre gen ON gg.genre_id = gen.id 
      WHERE g.id = $1 
      GROUP BY g.id, g.game_name, g.publisher, g.cost, g.year_of_release;
    `;
    const detailResult = await client.query(detailQuery, [gameId]);

    await client.query('COMMIT');
    return detailResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Ensure this is exported
module.exports = {
  getGames,
  getCategories,
  getGamesByCategory,
  getGameDetail,
  searchGames,
  updateGameAndGenres,
  addNewGenre,
  addGameAndGenres, // Add this to exports
};
