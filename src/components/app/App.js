import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import decoration from "../../resources/img/vision.png";

class App extends Component {
  state = {
    selectedChar: null,
    charList: [], // Сохраняем список персонажей на уровне приложения
    offset: 110, // Храним offset на уровне приложения
    
  };

  onCharSelected = (id) => {
    this.setState({ selectedChar: id });
  };

  onCharListLoaded = (newCharList) => {
    // Обновляем список персонажей после загрузки
    this.setState((prevState) => ({
      charList: [...prevState.charList, ...newCharList], // Добавляем новые персонажи
    }));
  };

  onLoadMore = () => {
    const { offset } = this.state;
    this.setState({ offset: offset + 9 }); // Обновляем offset для следующей загрузки
  };

  render() {
    const { selectedChar, charList, offset } = this.state;

    return (
      <Router>
        <div className="app">
          <AppHeader />
          <main>
            <Routes>
              {/* Главная страница */}
              <Route
                path="/"
                element={
                  <>
                    <ErrorBoundary>
                      <RandomChar />
                    </ErrorBoundary>
                    <div className="char__content">
                      <ErrorBoundary>
                        <CharList
                          onCharSelected={this.onCharSelected}
                          onCharListLoaded={this.onCharListLoaded}
                          charList={charList} // Передаем список через пропсы
                          offset={offset} // Передаем offset через пропсы
                          onLoadMore={this.onLoadMore} // Передаем функцию для загрузки следующего блока
                        />
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <CharInfo charId={selectedChar} />
                      </ErrorBoundary>
                    </div>
                    <img
                      className="bg-decoration"
                      src={decoration}
                      alt="vision"
                    />
                  </>
                }
              />
              {/* Страница Characters */}
              <Route
                path="/characters"
                element={
                  <>
                    <ErrorBoundary>
                      <CharList
                        onCharSelected={this.onCharSelected}
                        onCharListLoaded={this.onCharListLoaded}
                        charList={charList} // Передаем список через пропсы
                        offset={offset} // Передаем offset через пропсы
                        onLoadMore={this.onLoadMore} // Передаем функцию для загрузки следующего блока
                      />
                    </ErrorBoundary>
                  </>
                }
              />
              {/* Страница Comics */}
              <Route
                path="/comics"
                element={
                  <>
                    <ErrorBoundary>
                      <CharInfo charId={selectedChar} />
                    </ErrorBoundary>
                  </>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
