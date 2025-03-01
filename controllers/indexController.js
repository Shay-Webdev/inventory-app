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
  const genre = req.query.genre;
  console.log(genre);

  if (genre) {
    return getCategoryController(req, res);
  } else {
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
}

async function getCategoryController(req, res) {
  const id = req.params.id;
  const genre = req.query.genre;
  const rows = await db.getGamesByCategory(genre);
  if (!rows) {
    res.status(404).send({ message: 'No games found' });
  } else {
    // res.json(rows);
    res.render('../views/games.ejs', {
      title: genre,
      games: rows,
    });
  }
}

getGameDetailController = async (req, res) => {
  const id = req.params.id;
  const rows = await db.getGameDetail(id);
  if (!rows) {
    res.status(404).send({ message: 'No game found' });
  } else {
    // res.json(rows);
    res.render('../views/gameDetail.ejs', { title: `Detail`, game: rows });
  }
};
module.exports = {
  indexController,
  gamesController,
  categoriesController,
  getCategoryController,
  getGameDetailController,
};
