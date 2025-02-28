const db = require('../modules/queries');

async function indexController(req, res) {
  const rows = await db.getGames();
  if (!rows) {
    res.status(404).send({ message: 'No games found' });
  } else {
    // res.json(rows);
    res.render('../views/index.ejs', { title: `Home` });
  }
}

async function gamesController(req, res) {
  const rows = await db.getGames();
  if (!rows) {
    res.status(404).send({ message: 'No games found' });
  } else {
    // res.json(rows);
    res.render('../views/games.ejs', { title: `Games`, games: rows });
  }
}

async function categoriesController(req, res) {
  const rows = await db.getCategories();
  if (!rows) {
    res.status(404).send({ message: 'No games found' });
  } else {
    // res.json(rows);
    res.render('../views/categories.ejs', {
      title: `Categories`,
      categories: rows,
    });
  }
}

module.exports = {
  indexController,
  gamesController,
  categoriesController,
};
