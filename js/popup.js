let currentDeck = null;
let isProcessing = false;
let cancelRequested = false;

async function checkLigaSite() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    if (tab?.url) {
      const url = new URL(tab.url);
      const hostname = url.hostname.replace(/^www\./, '');
      return CONFIG.isLigaSite(hostname);
    }
    return false;
  } catch {
    return false;
  }
}

async function getCurrentLigaSite() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    if (tab?.url) {
      const url = new URL(tab.url);
      const hostname = url.hostname.replace(/^www\./, '');
      return CONFIG.getSiteName(hostname);
    }
    return null;
  } catch {
    return null;
  }
}

function showAlert(message) {
  const modal = document.getElementById('alert-modal');
  const messageElement = document.getElementById('alert-modal-message');
  const okButton = document.getElementById('alert-modal-ok');

  if (!modal || !messageElement || !okButton) return;

  messageElement.textContent = message;
  modal.style.display = 'flex';

  okButton.onclick = () => {
    modal.style.display = 'none';
  };

  const overlay = modal.querySelector('.alert-modal-overlay');
  if (overlay) {
    overlay.onclick = () => {
      modal.style.display = 'none';
    };
  }

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      modal.style.display = 'none';
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

document.addEventListener('DOMContentLoaded', async () => {
  const termsScreen = document.getElementById('terms-screen');
  const mainContainer = document.getElementById('main-container');
  const warningScreen = document.getElementById('warning-screen');
  const acceptTermsBtn = document.getElementById('accept-terms-btn');
  const termsFullLink = document.getElementById('terms-full-link');
  const ligaSitesButtons = document.getElementById('liga-sites-buttons');

  if (ligaSitesButtons) {
    const sites = CONFIG.LIGA_SITES;
    Object.keys(sites).forEach((hostname) => {
      const site = sites[hostname];
      const button = document.createElement('button');
      button.className = 'liga-site-btn';
      button.textContent = site.name;

      if (site.theme) {
        button.style.backgroundColor = site.theme.primary;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.2s';
        button.style.fontWeight = '600';

        // Hover effect
        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor =
            site.theme.primaryHover || site.theme.primary;
        });
        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = site.theme.primary;
        });
      }

      button.addEventListener('click', () => {
        chrome.tabs.create({ url: `https://${hostname}` });
      });
      ligaSitesButtons.appendChild(button);
    });
  }

  function showScreen(screen) {
    if (termsScreen)
      termsScreen.style.display = screen === 'terms' ? 'flex' : 'none';
    if (mainContainer)
      mainContainer.style.display = screen === 'main' ? 'block' : 'none';
    if (warningScreen)
      warningScreen.style.display = screen === 'warning' ? 'flex' : 'none';
  }

  const isOnLigaSite = await checkLigaSite();

  if (!isOnLigaSite) {
    showScreen('warning');
    return;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const dynamicSubtitle = document.getElementById('dynamic-subtitle');
  const subtitleHint = document.getElementById('subtitle-hint');

  if (tab?.url) {
    const url = new URL(tab.url);
    const hostname = url.hostname.replace(/^www\./, '');

    CONFIG.applyTheme(hostname);

    if (CONFIG.isLigaSite(hostname)) {
      const siteName = CONFIG.getSiteName(hostname);
      const gameName = CONFIG.getGameName(hostname);
      if (dynamicSubtitle) {
        dynamicSubtitle.textContent = `Buscando preços de cartas de <b>${gameName}</b> na <b>${siteName}</b>`;
      }
      if (subtitleHint) {
        subtitleHint.style.display = 'block';
      }
    } else {
      if (dynamicSubtitle) {
        dynamicSubtitle.textContent = 'Abra um site da Liga para começar';
      }
      if (subtitleHint) {
        subtitleHint.style.display = 'none';
      }
    }
  } else {
    if (dynamicSubtitle) {
      dynamicSubtitle.textContent = 'Abra um site da Liga para começar';
    }
    if (subtitleHint) {
      subtitleHint.style.display = 'none';
    }
  }

  chrome.storage.local.get(['termsAccepted'], (result) => {
    if (result.termsAccepted) {
      showScreen('main');
      initMainInterface();
    } else {
      showScreen('terms');
    }
  });

  if (acceptTermsBtn) {
    acceptTermsBtn.addEventListener('click', async () => {
      const isOnLigaSite = await checkLigaSite();
      if (!isOnLigaSite) {
        showScreen('warning');
        return;
      }

      chrome.storage.local.set({ termsAccepted: true }, () => {
        showScreen('main');
        initMainInterface();
      });
    });
  }

  if (termsFullLink) {
    termsFullLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({
        url: chrome.runtime.getURL('legal.html')
      });
    });
  }

  function initMainInterface() {
    const decklistInput = document.getElementById('decklist-input');
    const fileInput = document.getElementById('file-input');
    const processBtn = document.getElementById('process-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const downloadBtn = document.getElementById('download-btn');
    const logSection = document.getElementById('log-section');
    const logContent = document.getElementById('log-content');
    const progressSection = document.getElementById('progress-section');
    const resultSection = document.getElementById('result-section');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    function addLog(message, type = 'info') {
      const lines = message.split('\n');

      lines.forEach((line) => {
        if (line.trim() || lines.length === 1) {
          const logLine = document.createElement('div');
          logLine.className = `log-${type}`;
          logLine.textContent = line;
          logContent.appendChild(logLine);
        }
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const lastChild = logContent.lastElementChild;
          if (lastChild) {
            lastChild.scrollIntoView({ behavior: 'auto', block: 'end' });
          } else {
            logContent.scrollTop = logContent.scrollHeight;
          }
        });
      });
    }

    chrome.storage.local.get(['batchSize'], (result) => {
      if (result.batchSize) {
        const savedValue = parseInt(result.batchSize) || CONFIG.BATCH_SIZE;
        const validValue = Math.min(Math.max(savedValue, 1), 5);
        document.getElementById('batch-size').value = validValue;
        if (savedValue !== validValue) {
          chrome.storage.local.set({ batchSize: validValue });
        }
      }
    });

    const batchSizeInput = document.getElementById('batch-size');
    batchSizeInput.addEventListener('change', (e) => {
      let value = parseInt(e.target.value) || CONFIG.BATCH_SIZE;
      if (value > 5) {
        value = 5;
        batchSizeInput.value = 5;
        showAlert(
          'O número de cartas processadas em paralelo não pode ser maior que 5.'
        );
      }
      if (value < 1) {
        value = 1;
        batchSizeInput.value = 1;
      }
      chrome.storage.local.set({ batchSize: value });
    });

    function validateCardCount(deckText) {
      const uniqueCount = FileHandler.countUniqueCards(deckText);
      if (uniqueCount > CONFIG.MAX_UNIQUE_CARDS) {
        showAlert(
          `A decklist contém ${uniqueCount} cartas únicas. O limite máximo é ${CONFIG.MAX_UNIQUE_CARDS} cartas. Por favor, reduza a quantidade de cartas.`
        );
        return false;
      }
      return true;
    }

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          if (validateCardCount(fileContent)) {
            decklistInput.value = fileContent;
          } else {
            fileInput.value = '';
          }
        };
        reader.readAsText(file);
      }
    });

    processBtn.addEventListener('click', async () => {
      if (isProcessing) return;

      const isOnLigaSite = await checkLigaSite();
      if (!isOnLigaSite) {
        const supportedSites = CONFIG.getSupportedSiteNames().join(', ');
        showAlert(
          `Por favor, abra um site da Liga (${supportedSites}) para usar esta extensão.`
        );
        warningScreen.style.display = 'flex';
        mainContainer.style.display = 'none';
        return;
      }

      const decklistText = decklistInput.value.trim();
      if (!decklistText) {
        return showAlert(
          'Por favor, cole sua decklist ou selecione um arquivo.'
        );
      }

      if (!validateCardCount(decklistText)) {
        return;
      }

      let batchSize =
        parseInt(document.getElementById('batch-size').value) ||
        CONFIG.BATCH_SIZE;
      if (batchSize < 1) {
        showAlert(
          'O número de cartas processadas em paralelo deve ser pelo menos 1.'
        );
        return;
      }
      if (batchSize > 5) {
        batchSize = 5;
        document.getElementById('batch-size').value = 5;
        showAlert(
          'O número de cartas processadas em paralelo não pode ser maior que 5. O valor foi ajustado para 5.'
        );
      }

      chrome.storage.local.set({ batchSize });

      logContent.innerHTML = '';
      logSection.style.display = 'block';

      isProcessing = true;
      cancelRequested = false;
      processBtn.disabled = true;
      cancelBtn.style.display = 'block';
      resultSection.style.display = 'none';
      progressSection.style.display = 'block';

      try {
        const deck = FileHandler.readList(decklistText);
        currentDeck = deck;

        if (deck.cards.length === 0) {
          throw new Error('Nenhuma carta encontrada na decklist.');
        }

        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true
        });
        let currentHostname = null;
        if (tab?.url) {
          const url = new URL(tab.url);
          const hostname = url.hostname.replace(/^www\./, '');
          currentHostname = CONFIG.isLigaSite(hostname) ? hostname : null;
        }

        if (!currentHostname) {
          const supportedSites = CONFIG.getSupportedSiteNames().join(', ');
          throw new Error(
            `Site da Liga não detectado. Por favor, abra um site da Liga (${supportedSites}).`
          );
        }

        addLog(`Total de cartas: ${deck.cards.length}`, 'info');
        addLog(`Processando ${batchSize} carta(s) em paralelo...`, 'info');

        await BatchProcessor.getCardPrices(
          deck,
          batchSize,
          (message) => {
            addLog(message);
          },
          (progress) => {
            const percentage = Math.round(
              (progress.current / progress.total) * 100
            );
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `Processando grupo ${progress.batch}... (${progress.current}/${progress.total})`;
          },
          () => cancelRequested,
          currentHostname
        );

        if (!cancelRequested) {
          progressBar.style.width = '100%';
          progressText.textContent = 'Processamento concluído!';
          resultSection.style.display = 'block';
          addLog('');
          addLog('Processamento concluído com sucesso!', 'success');
        }
      } catch (error) {
        addLog('');
        addLog(`ERRO: ${error.message}`, 'error');
        progressText.textContent = 'Erro no processamento';
      } finally {
        isProcessing = false;
        processBtn.disabled = false;
        cancelBtn.style.display = 'none';
      }
    });

    cancelBtn.addEventListener('click', () => {
      cancelRequested = true;
      addLog('');
      addLog('Processamento cancelado pelo usuário.', 'info');
      isProcessing = false;
      processBtn.disabled = false;
      cancelBtn.style.display = 'none';
    });

    downloadBtn.addEventListener('click', () => {
      if (!currentDeck) {
        showAlert('Nenhum resultado disponível para download.');
        return;
      }

      const timestamp = Utils.getTimestamp().replace(/[: ]/g, '-');
      const filename = `ligaprice-${timestamp}.csv`;
      const csvContent = FileHandler.outputList(currentDeck);

      Utils.downloadCSV(csvContent, filename);
    });

    const legalLink = document.getElementById('legal-link');
    if (legalLink) {
      legalLink.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({
          url: chrome.runtime.getURL('legal.html')
        });
      });
    }
  }
});
