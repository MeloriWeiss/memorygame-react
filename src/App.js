import './App.css';
import config from "./config";
import React from "react";
import Card from "./components/Card";
import Popup from 'reactjs-popup';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      cards: [],
      couplesCompleted: 0,
      isPopupOpened: false
    }
  }

  componentDidMount() {
    this.startGame();
  }

  startGame() {
    this.setState({
      cards: this.prepareCards(),
      couplesCompleted: 0,
      isPopupOpened: false
    })
  }

  prepareCards() {
    let id = 1;
    return [...config.cards, ...config.cards]
        .sort(() => Math.random() - 0.5)
        .map(item => ({...item, id: id++, isOpened: false, isCompleted: false}));
  }

  choiceCardHandler(card) {
    if (card.isCompleted || this.state.cards.reduce((count, item) => item.isOpened ? count + 1 : count, 0) >= 2) {
      return;
    }

    this.setState({
      cards: this.state.cards.map(item => {
        return item.id === card.id ? {...item, isOpened: true} : item
      })
    }, () => {
      this.processChoosingCards();
    });
  }

  processChoosingCards() {
    const openedCards = this.state.cards.filter(card => card.isOpened);
    if (openedCards.length === 2) {
      if (openedCards[0].name === openedCards[1].name) {
        this.setState({
          cards: this.state.cards.map(card => {
            if (card.id === openedCards[0].id || card.id === openedCards[1].id) {
              card.isCompleted = true;
            }
            card.isOpened = false;
            return card;
          })
        }, () => {
          this.checkForAllCompleted();
        });
      } else {
        setTimeout(() => {
          this.setState({
            cards: this.state.cards.map(card => {
              card.isOpened = false;
              return card;
            })
          });
        }, 1000);
      }
      this.setState({
        couplesCompleted: this.state.couplesCompleted + 1
      });
    }
  }

  checkForAllCompleted() {
    if (this.state.cards.every(card => card.isCompleted)) {
      this.setState({
        isPopupOpened: true
      });
    }
  }

  closePopup() {
    this.setState({
      isPopupOpened: false
    });
    this.startGame();
  }

  render() {
    return (
        <div className="App">
          <header className="header">Memory Game</header>
          <div className="game">
            <div className="score">
              Ходов: {this.state.couplesCompleted}
            </div>
            <div className="cards">
              {this.state.cards.map(card => (
                  <Card card={card} onChoice={this.choiceCardHandler.bind(this)} key={card.id}/>
              ))}
            </div>
          </div>
          <Popup open={this.state.isPopupOpened} closeOnDocumentClick onClose={this.closePopup.bind(this)}>
            <div className="modal">
              <span className="close" onClick={this.closePopup.bind(this)}>
                &times;
              </span>
              Игра завершена! Ваш результат: {this.state.couplesCompleted}!
            </div>
          </Popup>
        </div>
    )
  }
}

export default App;
