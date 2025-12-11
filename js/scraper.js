class Scraper {
  /**
   * Determines which editions to find for a card
   * @param {Object} card - Card object (can be grouped or individual)
   * @param {boolean} isGrouped - If the card is grouped
   * @returns {Array<string|null>} Array of edition codes to find
   */
  static determineEditionsToFind(card, isGrouped) {
    const editionsToFind = [];

    if (isGrouped) {
      for (const c of card.all_cards || []) {
        const ed = c.edition;
        if (ed) {
          const edUpper = ed.toUpperCase();
          if (!editionsToFind.includes(edUpper)) {
            editionsToFind.push(edUpper);
          }
        } else {
          if (!editionsToFind.includes(null)) {
            editionsToFind.push(null);
          }
        }
      }
    } else {
      const desiredEdition = card.edition;
      if (desiredEdition) {
        editionsToFind.push(desiredEdition.toUpperCase());
      } else {
        editionsToFind.push(null);
      }
    }

    return editionsToFind;
  }

  /**
   * Updates the prices of a card with the found prices
   * @param {Object} card - Card object
   * @param {Object} allPrices - Object with prices by edition
   * @param {boolean} isGrouped - If the card is grouped
   */
  static updateCardPrices(card, allPrices, isGrouped) {
    const cardsToUpdate = isGrouped ? card.all_cards || [] : [card];

    if (!allPrices || Object.keys(allPrices).length === 0) {
      for (const c of cardsToUpdate) {
        if (!c.observation) {
          c.observation = 'Preços não encontrados';
        }
      }
      return;
    }

    for (const c of cardsToUpdate) {
      if (c.observation) {
        continue;
      }

      const cardEdition = c.edition ? c.edition.toUpperCase() : null;

      if (cardEdition && allPrices[cardEdition]) {
        c.prices = allPrices[cardEdition];
        c.detected_edition = cardEdition;
      } else if (!cardEdition && Object.keys(allPrices).length > 0) {
        const firstEdition = Object.keys(allPrices)[0];
        c.prices = allPrices[firstEdition];
        c.detected_edition = firstEdition;
      } else {
        c.observation = cardEdition
          ? `Edição [${cardEdition}] não encontrada`
          : 'Preços não encontrados';
      }
    }
  }

  /**
   * Defines the observation for a card
   * @param {Object} card - Card object
   * @param {string} observation - Observation to be defined
   * @param {boolean} isGrouped - If the card is grouped
   */
  static setObservation(card, observation, isGrouped) {
    const cardsToUpdate = isGrouped ? card.all_cards || [] : [card];
    for (const c of cardsToUpdate) {
      c.observation = observation;
    }
  }

  /**
   * Registers the result of a card in the log
   * @param {Object} card - Card object
   * @param {boolean} isGrouped - If the card is grouped
   * @param {boolean} success - If the operation was successful
   * @param {string|null} error - Error message (optional)
   * @param {Function|null} logCallback - Log callback (optional)
   */
  static logCardResult(
    card,
    isGrouped,
    success,
    error = null,
    logCallback = null
  ) {
    if (!logCallback) return;

    const timestamp = Utils.getTimestamp();
    const cardsToLog = isGrouped ? card.all_cards || [] : [card];

    for (const c of cardsToLog) {
      const cardName = c.name;
      const edition = c.edition || c.detected_edition || '';
      const prices = c.prices || [0.0, 0.0, 0.0];
      const observation = c.observation || '';
      const editionStr = edition ? ` [${edition}]` : '';

      if (success && (prices[0] > 0 || prices[1] > 0 || prices[2] > 0)) {
        const message = `[${timestamp}] ${cardName}${editionStr} - Min R$ ${prices[0].toFixed(
          2
        )}, Média R$ ${prices[1].toFixed(2)}, Max R$ ${prices[2].toFixed(2)}`;
        logCallback(message);
      } else {
        const errorMsg = error || observation || 'Preços não encontrados';
        const message = `[${timestamp}] ${cardName}${editionStr} - ERRO: ${errorMsg}`;
        logCallback(message);
      }
    }
  }

  /**
   * Searches for the price of a card on a Liga site
   * @param {Object} card - Card object
   * @param {Array|null} retryQueue - Retry queue (optional)
   * @param {Function|null} logCallback - Log callback (optional)
   * @param {string|null} hostname - Hostname of the Liga site (required)
   */
  static async getCardPrice(
    card,
    retryQueue = null,
    logCallback = null,
    hostname = null
  ) {
    const isGrouped = 'editions' in card && 'all_cards' in card;

    if (!hostname) {
      const errorMsg = 'Site da Liga não detectado';
      Scraper.setObservation(card, errorMsg, isGrouped);
      Scraper.logCardResult(card, isGrouped, false, errorMsg, logCallback);
      return;
    }

    const cardUrlTemplate = CONFIG.getCardUrlTemplate(hostname);
    if (!cardUrlTemplate) {
      const errorMsg = `Site ${hostname} não suportado`;
      Scraper.setObservation(card, errorMsg, isGrouped);
      Scraper.logCardResult(card, isGrouped, false, errorMsg, logCallback);
      return;
    }

    const cardName = card.name;
    const cardUrlEncoded = encodeURIComponent(cardName);
    const url = cardUrlTemplate.replace('{card_name}', cardUrlEncoded);

    try {
      await Utils.sleep(CONFIG.SLEEP_BETWEEN_REQUESTS);

      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9'
        }
      });

      if (response.status === 429) {
        const observation = 'Limite de taxa atingido - será reprocessado';
        Scraper.setObservation(card, observation, isGrouped);
        Scraper.logCardResult(
          card,
          isGrouped,
          false,
          '429 Muitas Requisições - Adicionado à fila de retry',
          logCallback
        );

        if (retryQueue !== null) {
          retryQueue.push(card);
        }

        await Utils.sleep(CONFIG.SLEEP_AFTER_429);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${
            response.statusText || 'Erro na requisição'
          }`
        );
      }

      const html = await response.text();
      const cardsEditions = HtmlParser.extractCardsEditions(html);

      if (!cardsEditions) {
        const observation = 'cards_editions não encontrado na página';
        Scraper.setObservation(card, observation, isGrouped);
        Scraper.logCardResult(card, isGrouped, false, observation, logCallback);
        return;
      }

      const editionsToFind = Scraper.determineEditionsToFind(card, isGrouped);
      const allPrices = PriceExtractor.extractPricesFromEditions(
        cardsEditions,
        editionsToFind
      );

      Scraper.updateCardPrices(card, allPrices, isGrouped);
      Scraper.logCardResult(card, isGrouped, true, null, logCallback);
    } catch (error) {
      const errorMsg = Utils.formatErrorMessage(error);
      const observation = `Erro na requisição HTTP: ${errorMsg}`;

      Scraper.setObservation(card, observation, isGrouped);
      Scraper.logCardResult(card, isGrouped, false, errorMsg, logCallback);
    }
  }
}
