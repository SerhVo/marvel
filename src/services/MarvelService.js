class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = "apikey=dc844dd35c8e21877417a1fe907539c1";

  getResource = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! ${url} status: ${response.status}`);
    }
    return await response.json();
  };
  // Get characters
  getAllCharacters = async () => {
    const response = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`
    );
    return response.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };
  _transformCharacter = (char) => {
    const description =
      char.description && char.description.length > 150
        ? char.description.slice(0, 150) + "..."
        : char.description || "Sorry, description not found";
    return {
      name: char.name,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      description: description,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
    };
  };
}

export default MarvelService;
