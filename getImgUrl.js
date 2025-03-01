require('dotenv').config();

async function getImageUrl(gameName) {
  try {
    const url = `https://www.giantbomb.com/api/games/?api_key=${
      process.env.GIANT_BOMB_API_KEY
    }&format=json&filter=name:${encodeURIComponent(
      gameName
    )}&field_list=name,image`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`No results found for ${gameName}`);
    }
    console.log(data);

    return data.results[0].image.original_url;
  } catch (error) {
    console.error(`Error fetching image for ${gameName}:`, error.message);
    return null; // Or handle the error as needed
  }
}

module.exports = getImageUrl;
