const pool = require('./pool');

const getGames = async () => {
  const { rows } = await pool.query('SELECT * FROM game');
  return rows;
};

const getCategories = async () => {
  const { rows } = await pool.query('SELECT * FROM genre');
  console.log(`All Categories: `, rows);

  return rows;
};

const getGamesByCategory = async (genre) => {
  const { rows } = await pool.query(
    'SELECT * FROM game JOIN game_genre ON game.id = game_genre.game_id JOIN genre ON game_genre.genre_id = genre.id  WHERE genre = $1',
    [genre]
  );
  console.log(`All Games of of genre ${genre}: `, rows);

  return rows;
};
module.exports = {
  getGames,
  getCategories,
  getGamesByCategory,
};
