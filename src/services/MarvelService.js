class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = "apikey=dc844dd35c8e21877417a1fe907539c1";
  _baseOffset = 210;

  getResource = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! ${url} status: ${response.status}`);
    }
    return await response.json();
  };
  // Get characters
  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
    );
    return res.data.results.map(this._transformCharacter);
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
      id: char.id,
      name: char.name,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      description: description,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
