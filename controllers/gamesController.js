const db = require('../modules/queries');

async function getEditPage(req, res) {
  const id = req.params.id;
  const rows = await db.getGameDetail(id);
  const allGenres = await db.getCategories();
  if (!rows) {
    res.status(404).send({ message: 'No game found' });
  } else {
    console.log('Game for Edit:', rows);
    console.log('All Genres:', allGenres);
    res.render('../views/edit.ejs', { title: `Edit`, game: rows, allGenres });
  }
}
async function updateGameAndGenresController(req, res) {
  console.log('Request received for updating game:', req.params.id);
  console.log('Request body:', req.body);
  const { id } = req.params;
  const {
    gameName,
    cost,
    genresToAdd,
    genresToRemove,
    newGenre,
    release_year,
    publisher,
  } = req.body;

  console.log('Release Year:', release_year);

  if (isNaN(id) || !Number.isInteger(Number(id))) {
    return res.status(400).send('Invalid game ID');
  }
  if (!gameName || typeof gameName !== 'string' || gameName.trim() === '') {
    return res.status(400).send('Invalid game name');
  }
  if (!publisher || typeof publisher !== 'string' || publisher.trim() === '') {
    return res.status(400).send('Invalid publisher');
  }
  const parsedCost = parseFloat(cost);
  if (isNaN(parsedCost) || parsedCost < 0) {
    return res.status(400).send('Invalid cost');
  }
  const parsedYear = parseInt(release_year, 10);
  if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 9999) {
    return res.status(400).send('Invalid release year');
  }

  try {
    let genreIdsToAdd = genresToAdd
      ? Array.isArray(genresToAdd)
        ? genresToAdd.map(Number)
        : [Number(genresToAdd)]
      : [];
    if (newGenre && newGenre.trim()) {
      const newGenreId = await db.addNewGenre(newGenre.trim());
      if (newGenreId) genreIdsToAdd.push(newGenreId);
    }

    const genreIdsToRemove = genresToRemove
      ? Array.isArray(genresToRemove)
        ? genresToRemove.map(Number)
        : [Number(genresToRemove)]
      : [];

    // Perform the update
    await db.updateGameAndGenres(
      id,
      gameName.trim(),
      parsedCost,
      genreIdsToAdd,
      genreIdsToRemove,
      parsedYear,
      publisher.trim()
    );

    // Re-fetch the full game details including genres
    const updatedGame = await db.getGameDetail(id);
    if (!updatedGame) {
      return res.status(404).send('Game not found');
    }
    console.log('Updated Game with Genres:', updatedGame); // Debug log
    res.render('gameDetail', { game: updatedGame });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).send('Server Error');
  }
}
module.exports = {
  getEditPage,
  updateGameAndGenresController,
};
