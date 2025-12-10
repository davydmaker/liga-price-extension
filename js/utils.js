class Utils {
  /**
   * Generates a formatted timestamp
   * @returns {string} Formatted timestamp
   */
  static getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Formats the error message
   * @param {Error|string} error - Error object or string
   * @returns {string} Formatted error message
   */
  static formatErrorMessage(error) {
    let errorMsg = String(error);
    if (errorMsg.includes("\n")) {
      errorMsg = errorMsg.split("\n")[0];
    }
    if (errorMsg.includes(":")) {
      errorMsg = errorMsg.split(":").slice(-1)[0].trim();
    }
    return errorMsg;
  }

  /**
   * Waits for a specified time
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise<void>}
   */
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Downloads a CSV file
   * @param {string} content - CSV file content
   * @param {string} filename - File name
   */
  static downloadCSV(content, filename) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true,
    });
  }

  /**
   * Escapes values for CSV format
   * @param {any} value - Value to be escaped
   * @returns {string} Escaped value
   */
  static escapeCSV(value) {
    if (value === null || value === undefined) {
      return "";
    }
    const stringValue = String(value);
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }
}
