import "./charList.scss";
import { Component } from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

class CharList extends Component {
  state = {
    loading: true,
    error: false,
    newItemLoading: false,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    const { charList } = this.props;
    if (charList && charList.length > 0) {
      this.setState({ loading: false });
    } else {
      this.onRequest();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.offset !== this.props.offset) {
      this.onRequest();
    }
  }

  onRequest = () => {
    const { offset } = this.props;
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoaded = (newCharList) => {
    const isCharEnded = newCharList.length < 9;
    this.setState({
      loading: false,
      newItemLoading: false,
      charEnded: isCharEnded,
    });
    this.props.onCharListLoaded(newCharList); // Обновляем список в родительском компоненте
  };

  onCharListLoading = () => {
    this.setState({ newItemLoading: true });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  renderItems(arr) {
    if (!Array.isArray(arr)) return null;

    const { selectedChar } = this.props; // Получаем ID выбранного персонажа из props

    const items = arr.map((item) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      const itemClass =
        item.id === selectedChar
          ? "char__item char__item_selected"
          : "char__item";

      return (
        <li
          className={itemClass}
          key={item.id}
          onClick={() => this.props.onCharSelected(item.id)}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    const isCharactersPage = window.location.pathname === "/characters";

    const gridStyle = {
      gridTemplateColumns: isCharactersPage
        ? "repeat(5, 200px)"
        : "repeat(3, 200px)",
    };

    return (
      <ul className="char__grid" style={gridStyle}>
        {items}
      </ul>
    );
  }

  render() {
    const { charList } = this.props;
    const { loading, error, newItemLoading, charEnded } = this.state;

    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        {!charEnded && (
          <button
            className="button button__main button__long"
            disabled={newItemLoading}
            onClick={this.props.onLoadMore}
          >
            <div className="inner">load more</div>
          </button>
        )}
      </div>
    );
  }
}

export default CharList;
