class BatchProcessor {
  /**
   * Groups cards by name
   * @param {Array} cards - Array of cards
   * @returns {Object} Object with cards grouped by name
   */
  static groupCardsByName(cards) {
    const cardsByName = {};
    for (const card of cards) {
      const cardName = card.name;
      if (!cardsByName[cardName]) {
        cardsByName[cardName] = [];
      }
      cardsByName[cardName].push(card);
    }
    return cardsByName;
  }

  /**
   * Creates a structure of grouped cards
   * @param {Object} cardsByName - Object with cards grouped by name
   * @returns {Array} Array of grouped cards
   */
  static createGroupedCards(cardsByName) {
    const groupedCards = [];
    for (const [cardName, cardList] of Object.entries(cardsByName)) {
      const mainCard = {
        name: cardName,
        editions: cardList.filter((c) => c.edition).map((c) => c.edition),
        all_cards: cardList
      };
      groupedCards.push(mainCard);
    }
    return groupedCards;
  }

  /**
   * Waits between batches with progressive sleep
   * @param {number} batchNum - Current batch number
   * @param {number} batchEnd - Final batch index
   * @param {number} totalGroups - Total number of groups
   * @param {string} timestamp - Timestamp for log
   * @param {Function|null} logCallback - Log callback (optional)
   */
  static async sleepBetweenBatches(
    batchNum,
    batchEnd,
    totalGroups,
    timestamp,
    logCallback = null
  ) {
    if (batchEnd >= totalGroups) {
      return;
    }

    let sleepTime = CONFIG.SLEEP_BETWEEN_BATCHES;

    if (batchNum >= CONFIG.PROGRESSIVE_SLEEP_START_BATCH) {
      let multiplier;
      if (batchNum <= 10) {
        multiplier = CONFIG.PROGRESSIVE_SLEEP_MULTIPLIERS.low;
      } else if (batchNum <= 15) {
        multiplier = CONFIG.PROGRESSIVE_SLEEP_MULTIPLIERS.medium;
      } else {
        multiplier = CONFIG.PROGRESSIVE_SLEEP_MULTIPLIERS.high;
      }

      sleepTime = CONFIG.SLEEP_BETWEEN_BATCHES * multiplier;
      const sleepMessage = `[${timestamp}] Tempo de espera aumentado para ${sleepTime.toFixed(
        1
      )}s (lote ${batchNum})`;
      if (logCallback) logCallback(sleepMessage);
    }

    await Utils.sleep(sleepTime);
  }

  /**
   * Reprocesses cards that failed with error 429
   * @param {Array} retryQueue - Queue of cards to retry
   * @param {Function|null} logCallback - Log callback (optional)
   * @param {Function|null} shouldCancelCallback - Function to check if processing should be cancelled (optional)
   */
  static async retryFailedCards(
    retryQueue,
    logCallback = null,
    shouldCancelCallback = null,
    hostname = null
  ) {
    if (retryQueue.length === 0) {
      return;
    }

    const retryStartTimestamp = Utils.getTimestamp();
    if (logCallback) {
      logCallback('');
      logCallback('='.repeat(60));
      logCallback(
        `[${retryStartTimestamp}] Reprocessando ${retryQueue.length} carta(s) que receberam erro 429...`
      );
      logCallback('='.repeat(60));
      logCallback('');
    }

    const seen = new Set();
    const uniqueRetryQueue = [];
    for (const card of retryQueue) {
      const cardId = `${card.name}|${JSON.stringify(card.editions || [])}`;
      if (!seen.has(cardId)) {
        seen.add(cardId);
        uniqueRetryQueue.push(card);
      }
    }

    for (let i = 0; i < uniqueRetryQueue.length; i++) {
      if (shouldCancelCallback?.()) {
        if (logCallback) logCallback('Reprocessamento cancelado.');
        break;
      }

      const mainCard = uniqueRetryQueue[i];
      const retryTimestamp = Utils.getTimestamp();
      const retryMessage = `[${retryTimestamp}] Tentativa ${i + 1}/${
        uniqueRetryQueue.length
      }: ${mainCard.name}`;
      if (logCallback) logCallback(retryMessage);

      for (const c of mainCard.all_cards || []) {
        if (c.observation && c.observation.startsWith('Limite de taxa')) {
          c.observation = '';
        }
      }

      await Scraper.getCardPrice(mainCard, null, logCallback, hostname);

      if (i < uniqueRetryQueue.length - 1) {
        await Utils.sleep(CONFIG.SLEEP_AFTER_429);
      }
    }

    if (!shouldCancelCallback?.()) {
      const retryEndTimestamp = Utils.getTimestamp();
      if (logCallback) {
        logCallback('');
        logCallback(`[${retryEndTimestamp}] Reprocessamento concluído.`);
      }
    }
  }

  /**
   * Processes cards in batches
   * @param {Object} deck - Deck object with cards
   * @param {number} batchSize - Batch size
   * @param {Function|null} logCallback - Log callback (optional)
   * @param {Function|null} progressCallback - Progress callback (optional)
   * @param {Function|null} shouldCancelCallback - Function to check if processing should be cancelled (optional)
   * @returns {Promise<Object>} Processed deck
   */
  static async getCardPrices(
    deck,
    batchSize = CONFIG.BATCH_SIZE,
    logCallback = null,
    progressCallback = null,
    shouldCancelCallback = null,
    hostname = null
  ) {
    const cardsByName = BatchProcessor.groupCardsByName(deck.cards);
    const groupedCards = BatchProcessor.createGroupedCards(cardsByName);

    const totalGroups = groupedCards.length;
    const retryQueue = [];

    if (!hostname) {
      if (logCallback) logCallback('ERRO: Site da Liga não detectado.');
      return deck;
    }

    for (
      let batchStart = 0;
      batchStart < totalGroups;
      batchStart += batchSize
    ) {
      if (shouldCancelCallback?.()) {
        if (logCallback) logCallback('Processamento cancelado.');
        break;
      }

      const batchEnd = Math.min(batchStart + batchSize, totalGroups);
      const batch = groupedCards.slice(batchStart, batchEnd);
      const batchNum = Math.floor(batchStart / batchSize) + 1;

      const batchTimestamp = Utils.getTimestamp();
      const batchMessage = `[${batchTimestamp}] Processando lote ${batchNum} (${batch.length} carta(s) em paralelo)...`;
      if (logCallback) {
        logCallback('');
        logCallback(batchMessage);
      }

      if (progressCallback) {
        progressCallback({
          current: batchStart,
          total: totalGroups,
          batch: batchNum
        });
      }

      const promises = batch.map((mainCard) =>
        Scraper.getCardPrice(mainCard, retryQueue, logCallback, hostname)
      );

      await Promise.all(promises);

      if (shouldCancelCallback?.()) {
        if (logCallback) logCallback('Processamento cancelado.');
        break;
      }

      const batchEndTimestamp = Utils.getTimestamp();
      const batchEndMessage = `[${batchEndTimestamp}] Lote ${batchNum} concluído.`;
      if (logCallback) logCallback(batchEndMessage);

      await BatchProcessor.sleepBetweenBatches(
        batchNum,
        batchEnd,
        totalGroups,
        batchEndTimestamp,
        logCallback
      );
    }

    if (!shouldCancelCallback?.()) {
      await BatchProcessor.retryFailedCards(
        retryQueue,
        logCallback,
        shouldCancelCallback,
        hostname
      );
    }

    return deck;
  }
}
