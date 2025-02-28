const pool = require('./pool');

const getGames = async () => {
  const { rows } = await pool.query('SELECT * FROM game');
  return rows;
};

module.exports = {
  getGames,
};
