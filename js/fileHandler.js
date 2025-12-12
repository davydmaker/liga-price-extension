class FileHandler {
  /**
   * Counts unique cards by name (ignoring edition)
   * @param {string} deckText - Decklist text
   * @returns {number} Number of unique cards
   */
  static countUniqueCards(deckText) {
    const lines = deckText.split('\n');
    const cardList = lines.map((line) => line.trim()).filter((line) => line);
    const uniqueCardNames = new Set();

    for (const line of cardList) {
      const editionMatch = line.match(/\[([^\]]+)\]/);
      let cardName = line;

      if (editionMatch) {
        cardName = line.replace(/\s*\[[^\]]+\]\s*/, ' ').trim();
      }

      if (cardName) {
        uniqueCardNames.add(cardName.toLowerCase().trim());
      }
    }

    return uniqueCardNames.size;
  }

  /**
   * Counts cards considering edition if site supports edition parameter
   * @param {string} deckText - Decklist text
   * @param {boolean} countEditionsSeparately - If true, cards with different editions count separately
   * @returns {number} Number of cards (unique by name+edition if countEditionsSeparately is true)
   */
  static countCards(deckText, countEditionsSeparately = false) {
    const lines = deckText.split('\n');
    const cardList = lines.map((line) => line.trim()).filter((line) => line);

    if (countEditionsSeparately) {
      const uniqueCards = new Set();
      for (const line of cardList) {
        const editionMatch = line.match(/\[([^\]]+)\]/);
        let cardName = line;
        let edition = null;

        if (editionMatch) {
          edition = editionMatch[1].toUpperCase().trim();
          cardName = line.replace(/\s*\[[^\]]+\]\s*/, ' ').trim();
        }

        const key = `${cardName.toLowerCase().trim()}|${edition || ''}`;
        uniqueCards.add(key);
      }
      return uniqueCards.size;
    } else {
      return FileHandler.countUniqueCards(deckText);
    }
  }

  /**
   * Reads and processes a decklist in text format
   * @param {string} deckText - Decklist text (one card per line)
   * @returns {Object} Deck object with array of cards
   */
  static readList(deckText) {
    const lines = deckText.split('\n');
    const cardList = lines.map((line) => line.trim()).filter((line) => line);

    const deck = { cards: [] };
    const seenCards = new Set();

    for (const line of cardList) {
      const cardDict = {};

      const editionMatch = line.match(/\[([^\]]+)\]/);
      let editionCode = null;
      let cardName = line;

      if (editionMatch) {
        editionCode = editionMatch[1].toUpperCase().trim();
        cardName = line.replace(/\s*\[[^\]]+\]\s*/, ' ').trim();
      }

      if (!cardName) {
        continue;
      }

      cardDict.name = cardName;
      cardDict.edition = editionCode;

      const uniqueKey = `${cardName.toLowerCase()}|${editionCode || ''}`;

      if (seenCards.has(uniqueKey)) {
        continue;
      }

      seenCards.add(uniqueKey);
      deck.cards.push(cardDict);
    }

    return deck;
  }

  /**
   * Converts a deck to CSV format
   * @param {Object} deck - Deck object with cards and prices
   * @returns {string} Formatted CSV content
   */
  static outputList(deck) {
    const headers = [
      'name',
      'edition',
      'min_price',
      'avg_price',
      'max_price',
      'observation'
    ];
    const rows = [headers.map(Utils.escapeCSV).join(',')];

    for (const card of deck.cards) {
      const edition = card.edition || card.detected_edition || '';
      const prices = card.prices || [0.0, 0.0, 0.0];
      let observation = card.observation || '';

      if (
        !observation &&
        prices[0] === 0 &&
        prices[1] === 0 &&
        prices[2] === 0
      ) {
        observation = 'Preços não encontrados';
      }

      if (card.edition && !edition) {
        observation = `Edição [${card.edition}] não encontrada`;
      }

      const row = [
        Utils.escapeCSV(card.name),
        Utils.escapeCSV(edition),
        prices[0] > 0 ? prices[0].toFixed(2) : '',
        prices[1] > 0 ? prices[1].toFixed(2) : '',
        prices[2] > 0 ? prices[2].toFixed(2) : '',
        Utils.escapeCSV(observation)
      ];

      rows.push(row.join(','));
    }

    return rows.join('\n');
  }
}
