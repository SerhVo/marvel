import { Component } from "react";
// import PropTypes from "prop-types";
import "./charInfo.scss";
import Skeleton from "../skeleton/Skeleton";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import MarvelService from "../../services/MarvelService";

class CharInfo extends Component {
  state = { char: null, loading: false, error: false };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.charId !== this.props.charId) {
      this.updateChar();
    }
  }
//   componentDidCatch(error, info) {
//       console.error("Error in CharInfo component", error, info);
//       this.setState({ error: true });
//   }

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return; // If no character ID is provided, do nothing and return immediately.
    }

    this.onCharLoading();

    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };

  onCharLoading = () => {
    this.setState({ loading: true });
  };
  onError = () => {
    this.setState({ loading: false, error: true });
  };
  

  render() {
    const { char, loading, error } = this.state;
    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;
    return (
      <div className="char__info">
        {errorMessage}
        {skeleton}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  let imgStyle = { objectFit: "cover" };
  if (
    thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgStyle = { objectFit: "unset" };
  }
  const isComicsPage = window.location.pathname === "/comics";
  const gridStyle = {
    gridTemplateColumns: isComicsPage ? "auto" : "150px auto",
  };

  const charBasicsImg = {
    width: isComicsPage ? "450px" : "150px",
    height: isComicsPage ? "auto" : "150px",
  };
  return (
    <>
      <div className="char__basics" style={gridStyle}>
        <img src={thumbnail} alt={name} style={(imgStyle, charBasicsImg)} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length === 0 ? (
          <li className="char__comics-item">No comics found</li>
        ) : (
          comics.slice(0, 10).map((comic, i) => (
            <li key={i} className="char__comics-item">
              {comic.name}
            </li>
          ))
        )}
      </ul>
    </>
  );
};

export default CharInfo;
