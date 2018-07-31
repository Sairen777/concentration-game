class MemoryGame {
  constructor() {
    this.gameField = document.getElementById("card-cells");
    this.cardPairsNumber = 9;
    this.cardDescriptions = {
      rank: ["0", "2", "3", "4", "5", "6", "7", "8", "9", "A", "J", "K", "Q"],
      suit: ["C", "D", "H", "S"]
    };
    
    this.shownCardsTimer = null;
    this.openedPairs = 0;
    this.openedCards = [];
    this.score = 0;
  }

  evaluateScore(isGuessedRight) {
    if (isGuessedRight) {
      this.score += 42 * (this.cardPairsNumber - this.openedPairs);
    } else {
      this.score -= 42 * this.openedPairs;
    }
  }

  generateCardName() {
    let rankIndex = Math.floor(Math.random() * this.cardDescriptions.rank.length);
    let suitIndex = Math.floor(Math.random() * this.cardDescriptions.suit.length);
    let rankName = this.cardDescriptions.rank[rankIndex];
    let suitName = this.cardDescriptions.suit[suitIndex];

    return rankName.toString() + suitName.toString();
  }

  generateCardsArray() {
    let cardsArray = [];
    for (let cardNum = 0; cardNum < this.cardPairsNumber; cardNum++) {
      let cardName = this.generateCardName();

      while (cardsArray.includes(cardName)) {
        cardName = this.generateCardName();
      }

      cardsArray.push(cardName);
      cardsArray.push(cardName);
    }
    
    return cardsArray;
  }

  shuffleCardsArray(cardsArray) {
    for (let i = cardsArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }

    return cardsArray;
  } 
}