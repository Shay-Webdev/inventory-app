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
module.exports = {
  getGames,
  getCategories,
  getGamesByCategory,
  getGameDetail,
};
