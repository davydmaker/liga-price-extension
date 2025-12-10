class HtmlParser {
  /**
   * Extracts the cards_editions array from the HTML page
   * @param {string} htmlContent - HTML content of the page
   * @returns {Array|null} Array of editions or null if not found
   */
  static extractCardsEditions(htmlContent) {
    const pattern = /var\s+cards_editions\s*=\s*(\[.*?\])\s*;/s;

    const match = htmlContent.match(pattern);
    if (!match) {
      return null;
    }

    try {
      let jsonStr = match[1];
      jsonStr = jsonStr.replace(/\/\/.*$/gm, "");
      jsonStr = jsonStr.replace(/\/\*.*?\*\//gs, "");

      const editionsData = JSON.parse(jsonStr);
      return editionsData;
    } catch (error) {
      return null;
    }
  }
}
