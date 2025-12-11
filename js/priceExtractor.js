class PriceExtractor {
  /**
   * Extracts the normal price from the price data
   * @param {Object|Array} priceData - Price data
   * @returns {Object|null} Normal price object or null
   */
  static extractNormalPrice(priceData) {
    if (!priceData) {
      return null;
    }

    let normalPrice = null;

    if (typeof priceData === 'object' && !Array.isArray(priceData)) {
      normalPrice = priceData['0'] || priceData[0];
    } else if (Array.isArray(priceData) && priceData.length > 0) {
      normalPrice = priceData[0];
    }

    return normalPrice;
  }

  /**
   * Parses the price values (min, average, max)
   * @param {Object} normalPrice - Normal price object
   * @returns {Array<number>} Array [min, average, max]
   */
  static parsePriceValues(normalPrice) {
    const editionPrices = [0.0, 0.0, 0.0];

    if (!normalPrice) {
      return editionPrices;
    }

    const minVal = normalPrice.p || '';
    const medVal = normalPrice.m || '';
    const maxVal = normalPrice.g || '';

    if (minVal) {
      const parsed = parseFloat(String(minVal).replace(',', '.'));
      if (!isNaN(parsed)) {
        editionPrices[0] = parsed;
      }
    }

    if (medVal) {
      const parsed = parseFloat(String(medVal).replace(',', '.'));
      if (!isNaN(parsed)) {
        editionPrices[1] = parsed;
      }
    }

    if (maxVal) {
      const parsed = parseFloat(String(maxVal).replace(',', '.'));
      if (!isNaN(parsed)) {
        editionPrices[2] = parsed;
      }
    }

    return editionPrices;
  }

  /**
   * Extracts prices from all found editions
   * @param {Array} cardsEditions - Array of card editions
   * @param {Array<string|null>} editionsToFind - Array of edition codes to find
   * @returns {Object} Object with prices by edition {EDITION: [min, average, max]}
   */
  static extractPricesFromEditions(cardsEditions, editionsToFind) {
    const allPrices = {};

    for (const editionData of cardsEditions) {
      const edCode = (editionData.code || '').toUpperCase();

      if (!editionsToFind.includes(null) && !editionsToFind.includes(edCode)) {
        continue;
      }

      if (allPrices[edCode]) {
        continue;
      }

      const priceData = editionData.price;
      const normalPrice = PriceExtractor.extractNormalPrice(priceData);

      if (normalPrice) {
        const editionPrices = PriceExtractor.parsePriceValues(normalPrice);

        if (
          editionPrices[0] > 0 ||
          editionPrices[1] > 0 ||
          editionPrices[2] > 0
        ) {
          allPrices[edCode] = editionPrices;
        }
      }
    }

    return allPrices;
  }
}
