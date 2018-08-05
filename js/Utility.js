var utility = (function() {
  let game = new MemoryGame();

  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const gameOverScreen = document.getElementById("game-over-screen");
  const gameField = document.getElementById("card-cells");
  const scoreFields = document.querySelectorAll(".score-field");
  const cardsInRow = 6;
  const totalCardsNumber = game.cardPairsNumber * 2;
  const totalPairsNumber = game.cardPairsNumber;

  let isFirstCardInRow = cardNum => {
    return cardNum % cardsInRow === 0;
  };

  let startNewRow = () => {
    let rowSeparator = document.createElement("div");
    rowSeparator.classList.add("w-100", "d-none", "d-lg-block");
    gameField.appendChild(rowSeparator);
  };

  let gemerateSingleCardCell = () => {
    let parentCardCell = document.createElement("div");
    parentCardCell.classList.add(
      "col-lg-1", "col-md-2", "col-3", 'card-container'
    );

    let childCardFrontCell = document.createElement("div");
    childCardFrontCell.classList.add("front");

    let cardBackImage = document.createElement("img");
    cardBackImage.src = "assets/Cards/CardBack.png";
    cardBackImage.alt = "Click to flip!";
    cardBackImage.classList.add("img-fluid", "d-none");
    cardBackImage.setAttribute("data-tid", "Card");
    addClickHandler(cardBackImage, game);

    childCardFrontCell.appendChild(cardBackImage);

    let childCardBackCell = document.createElement("div");
    childCardBackCell.classList.add("back", "card-back-container");

    parentCardCell.appendChild(childCardFrontCell);
    parentCardCell.appendChild(childCardBackCell);

    return parentCardCell;
  };

  let generateCardCells = () => {
    for (let cardNum = 0; cardNum < totalCardsNumber; cardNum++) {
      let cardCell = gemerateSingleCardCell();

      if (isFirstCardInRow(cardNum)) {
        startNewRow();
        cardCell.classList.add("offset-lg-2");
      }

      gameField.appendChild(cardCell);
    }
  };

  let createCardElementFromName = cardName => {
    let cardImageElement = document.createElement("img");
    cardImageElement.src = "assets/Cards/" + cardName + ".png";
    cardImageElement.alt = cardName;
    cardImageElement.classList.add("img-fluid");

    return cardImageElement;
  };

  let generateCardElements = cardsNamesArray => {
    let cardContainers = 
      [...document.getElementsByClassName("card-back-container")];

    for (let i = 0; i < cardsNamesArray.length; i++) {
      let cardName = cardsNamesArray[i].toString();
      let cardElement = createCardElementFromName(cardName);
      cardContainers[i].parentNode.setAttribute("card-name", cardName);
      cardContainers[i].appendChild(cardElement);
    }
  };

  let cardClickAction = (clickedCardCell, openedCards) => {
    clickedCardCell.classList.add("selected");
    let clickedCardName = clickedCardCell.getAttribute("card-name");
    openedCards.push(clickedCardName);
  };

  let resolveOpenedPair = (game) => {
    let isGuessedRight = (game.openedCards[0] === game.openedCards[1]);

    if (isGuessedRight) game.openedPairs++;

    let chosenPair = document.querySelectorAll(".selected");
    gameField.style.pointerEvents = 'none';
    chosenPair.forEach(card => {
      card.classList.remove("selected");
      if (isGuessedRight) {
        setTimeout(() => {
          card.classList.add("invisible");
          gameField.style.pointerEvents = 'auto';          
        }, 800);
      } else {
        setTimeout(() => {
          flipCard(card);
          gameField.style.pointerEvents = 'auto';          
        }, 800);
      }
    });

    return isGuessedRight;
  };

  let flipCard = cardContainer => {
    let cardBack = cardContainer.childNodes[0].childNodes[0];
    let cardFront =  cardContainer.childNodes[1].childNodes[0];
    cardBack.classList.toggle("d-none");
    cardFront.classList.toggle("d-none");
  };

  let addClickHandler = (elem, game) => {
    elem.addEventListener("click", function(e) {
      let clickedCardCell = this.parentNode.parentNode;

      flipCard(clickedCardCell);

      if (game.openedCards.length < 2) 
        cardClickAction(clickedCardCell, game.openedCards);

      if (game.openedCards.length === 2) {
        let isGuessedRight = resolveOpenedPair(game);

        game.openedCards = [];
        game.evaluateScore(isGuessedRight);
        updateScoreFields(game.score);

        if (game.openedPairs === totalPairsNumber)
          setTimeout(showEndScreen, 500);
      }
    });
  };

  let updateScoreFields = score => {
    document.querySelectorAll(".score-field").forEach(field => {
      field.innerText = score;
    });
  };

  let showEndScreen = () => {
    gameScreen.classList.toggle("d-none");
    gameOverScreen.classList.toggle("d-none");
  };

  let flipAllCards = () => {
    let allCardContainers = document.querySelectorAll(".card-container");
    allCardContainers.forEach(card => {
      flipCard(card);
    });
  };

  let clearGameField = () => {
    while (gameField.firstChild) {
      gameField.removeChild(gameField.firstChild);
    }

    scoreFields.forEach(field => {
      field.innerText = "0";
    });
  };

  let addClassIfNotExist = (elem, className) => {
    if (!elem.classList.contains(className)) elem.classList.add(className);
  };

  let showGamePage = () => {
    addClassIfNotExist(startScreen, "d-none");
    addClassIfNotExist(gameOverScreen, "d-none");
    gameScreen.classList.remove("d-none");
  };

  let startNewGame = () => {
    clearTimeout(game.shownCardsTimer);
    game = new MemoryGame();
    clearGameField();
    showGamePage();
    generateCardCells();
    generateCardElements(game.shuffleCardsArray(game.generateCardsArray()));
    game.shownCardsTimer = setTimeout(flipAllCards, 5000);
  };

  return {
    startNewGame: startNewGame
  };
})();
