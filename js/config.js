const CONFIG = {
  BATCH_SIZE: 5,
  SLEEP_BETWEEN_REQUESTS: 300, // ms
  SLEEP_BETWEEN_BATCHES: 1000, // ms
  SLEEP_AFTER_429: 2000, // ms
  PROGRESSIVE_SLEEP_START_BATCH: 7,
  PROGRESSIVE_SLEEP_MULTIPLIERS: {
    low: 1.5,
    medium: 2.0,
    high: 2.5,
  },
  CARD_URL_TEMPLATE:
    "https://www.ligamagic.com.br/?view=cards/card&card={card_name}",
  MAX_UNIQUE_CARDS: 100, // Maximum number of unique cards (same name counts as 1)
};
