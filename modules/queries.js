const pool = require('./pool');

const getGames = async () => {
  const { rows } = await pool.query('SELECT * FROM game');
  return rows;
};

const getCategories = async () => {
  const { rows } = await pool.query('SELECT * FROM genre');
  console.log(rows);

  return rows;
};

module.exports = {
  getGames,
  getCategories,
};
