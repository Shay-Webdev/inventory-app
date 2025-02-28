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

module.exports = {
  indexController,
};
