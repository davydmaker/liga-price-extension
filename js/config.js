const CONFIG = {
  BATCH_SIZE: 5,
  SLEEP_BETWEEN_REQUESTS: 300, // ms
  SLEEP_BETWEEN_BATCHES: 1000, // ms
  SLEEP_AFTER_429: 2000, // ms
  FETCH_TIMEOUT: 30000,
  PROGRESSIVE_SLEEP_START_BATCH: 7,
  PROGRESSIVE_SLEEP_MULTIPLIERS: {
    low: 1.5,
    medium: 2.0,
    high: 2.5
  },
  MAX_UNIQUE_CARDS: 100,
  LIGA_SITES: {
    'ligamagic.com.br': {
      name: 'LigaMagic',
      gameName: 'Magic: The Gathering',
      template:
        'https://www.ligamagic.com.br/?view=cards/card&card={card_name}',
      theme: {
        primary: '#ff5a00',
        primaryHover: '#e45000',
        secondary: '#e74c3c',
        secondaryHover: '#c0392b',
        success: '#22b14c',
        warning: '#e74c3c'
      }
    },
    'ligapokemon.com.br': {
      name: 'LigaPokemon',
      gameName: 'Pokémon TCG',
      template:
        'https://www.ligapokemon.com.br/?view=cards/card&card={card_name}',
      supportsEditionParam: true,
      theme: {
        primary: '#ff3e32',
        primaryHover: '#f13125',
        secondary: '#ed3125',
        secondaryHover: '#cd190e',
        success: '#2faf4a',
        warning: '#bb8412'
      }
    },
    'ligayugioh.com.br': {
      name: 'LigaYuGiOh',
      gameName: 'Yu-Gi-Oh!',
      template:
        'https://www.ligayugioh.com.br/?view=cards/card&card={card_name}',
      theme: {
        primary: '#9002b3',
        primaryHover: '#7a0098',
        secondary: '#e74c3c',
        secondaryHover: '#c0392b',
        success: '#22b14c',
        warning: '#e74c3c'
      }
    },
    'ligaonepiece.com.br': {
      name: 'LigaOnePiece',
      gameName: 'One Piece Card Game',
      template:
        'https://www.ligaonepiece.com.br/?view=cards/card&card={card_name}',
      supportsEditionParam: true,
      theme: {
        primary: '#eba410',
        primaryHover: '#b98210',
        secondary: '#b98210',
        secondaryHover: '#b98210',
        success: '#22b14c',
        warning: '#bb8412'
      }
    },
    'ligafab.com.br': {
      name: 'LigaFAB',
      gameName: 'Flesh and Blood',
      template: 'https://www.ligafab.com.br/?view=cards/card&card={card_name}',
      theme: {
        primary: '#3a261e',
        primaryHover: '#52382f',
        secondary: '#e74c3c',
        secondaryHover: '#c0392b',
        success: '#22b14c',
        warning: '#e74c3c'
      }
    },
    'ligalorcana.com.br': {
      name: 'LigaLorcana',
      gameName: 'Disney Lorcana',
      template:
        'https://www.ligalorcana.com.br/?view=cards/card&card={card_name}',
      supportsEditionParam: true,
      theme: {
        primary: '#ce08ff',
        primaryHover: '#c836ec',
        secondary: '#d118ff',
        secondaryHover: '#c836ec',
        success: '#22b14c',
        warning: '#e74c3c'
      }
    },
    'masters.ligadragonball.com.br': {
      name: 'LigaDragonBall: Masters',
      gameName: 'Dragon Ball Super Card Game (Masters)',
      template:
        'https://masters.ligadragonball.com.br/?view=cards/card&card={card_name}',
      supportsEditionParam: true,
      theme: {
        primary: '#fe9700',
        primaryHover: '#ff7800',
        secondary: '#e74c3c',
        secondaryHover: '#c0392b',
        success: '#22b14c',
        warning: '#e74c3c'
      }
    },
    'fusion.ligadragonball.com.br': {
      name: 'LigaDragonBall: Fusion',
      gameName: 'Dragon Ball Super Card Game (Fusion)',
      template:
        'https://fusion.ligadragonball.com.br/?view=cards/card&card={card_name}',
      supportsEditionParam: true,
      theme: {
        primary: '#fb570f',
        primaryHover: '#fd7628',
        secondary: '#e74c3c',
        secondaryHover: '#c0392b',
        success: '#22b14c',
        warning: '#e74c3c'
      }
    },
    'ligavanguard.com.br': {
      name: 'LigaVanguard',
      gameName: 'Cardfight!! Vanguard',
      template:
        'https://www.ligavanguard.com.br/?view=cards/card&card={card_name}',
      supportsEditionParam: true,
      theme: {
        primary: '#262a78',
        primaryHover: '#12154b',
        secondary: '#e74c3c',
        secondaryHover: '#c0392b',
        success: '#22b14c',
        warning: '#e74c3c'
      }
    },
    'ligastarwars.com.br': {
      name: 'LigaStarWars',
      gameName: 'Star Wars: Unlimited',
      template:
        'https://www.ligastarwars.com.br/?view=cards/card&card={card_name}',
      supportsEditionParam: true,
      theme: {
        primary: '#07634a',
        primaryHover: '#23705c',
        secondary: '#327e6a',
        secondaryHover: '#23705c',
        success: '#22b14c',
        warning: '#e74c3c'
      }
    },
    'ligadigimon.com.br': {
      name: 'LigaDigimon',
      gameName: 'Digimon Card Game',
      template:
        'https://www.ligadigimon.com.br/?view=cards/card&card={card_name}',
      supportsEditionParam: true,
      theme: {
        primary: '#25b1e7',
        primaryHover: '#006cff',
        secondary: '#006cff',
        secondaryHover: '#006cff',
        success: '#22b14c',
        warning: '#e74c3c'
      }
    }
  },
  getSupportedSiteNames() {
    return Object.values(this.LIGA_SITES).map((site) => site.name);
  },
  getCardUrlTemplate(hostname) {
    const site = this.LIGA_SITES[hostname];
    return site ? site.template : null;
  },
  getSiteName(hostname) {
    const site = this.LIGA_SITES[hostname];
    return site ? site.name : null;
  },
  getGameName(hostname) {
    const site = this.LIGA_SITES[hostname];
    return site ? site.gameName : null;
  },
  isLigaSite(hostname) {
    return hostname in this.LIGA_SITES;
  },
  getTheme(hostname) {
    const site = this.LIGA_SITES[hostname];
    return site ? site.theme : null;
  },
  applyTheme(hostname) {
    const theme = this.getTheme(hostname);
    if (!theme) {
      const root = document.documentElement;
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-primary-hover');
      root.style.removeProperty('--color-secondary');
      root.style.removeProperty('--color-secondary-hover');
      root.style.removeProperty('--color-success');
      root.style.removeProperty('--color-warning');
      return;
    }

    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-hover', theme.primaryHover);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-secondary-hover', theme.secondaryHover);
    root.style.setProperty('--color-success', theme.success);
    root.style.setProperty('--color-warning', theme.warning);
  }
};
