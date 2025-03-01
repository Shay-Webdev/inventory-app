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
  const query = req.query.search;
  console.log(query);

  if (query) {
    return searchGamesController(req, res);
  }
  {
    if (!rows) {
      res.status(404).send({ message: 'No games found' });
    } else {
      // res.json(rows);
      res.render('../views/games.ejs', { title: `Games`, games: rows });
    }
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

const getGameDetailController = async (req, res) => {
  const id = req.params.id;
  const rows = await db.getGameDetail(id);
  if (!rows) {
    res.status(404).send({ message: 'No game found' });
  } else {
    // res.json(rows);
    res.render('../views/gameDetail.ejs', { title: `Detail`, game: rows });
  }
};

async function searchGamesController(req, res) {
  const query = req.query.search;
  console.log(query);

  const rows = await db.searchGames(query);
  if (!rows || rows.length === 0) {
    res.status(404).render('../views/error.ejs', {
      title: 'Error',
      message: 'No games found',
    });
  } else {
    // res.json(rows);
    res.render('../views/games.ejs', {
      title: `Search Results for ${query}`,
      games: rows,
    });
  }
}

module.exports = {
  indexController,
  gamesController,
  categoriesController,
  getCategoryController,
  getGameDetailController,
  searchGamesController,
};
