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
  window.addEventListener('beforeunload', () => {
    if (isProcessing) {
      cancelRequested = true;
    }
  });

  window.addEventListener('pagehide', () => {
    if (isProcessing) {
      cancelRequested = true;
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isProcessing) {
      cancelRequested = true;
    }
  });

  const versionText = document.getElementById('version-text');
  if (versionText) {
    const manifest = chrome.runtime.getManifest();
    versionText.textContent = `v${manifest.version} - `;
  }

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
        button.style.transition = 'background-color 0.2s';
        button.style.fontWeight = '600';
        button.style.boxShadow = 'none';

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

  async function checkVersionUpdate() {
    const manifest = chrome.runtime.getManifest();
    const currentVersion = manifest.version;

    chrome.storage.local.get(['changelogSeenVersions'], (result) => {
      const seenVersions = result.changelogSeenVersions || [];

      if (seenVersions.includes(currentVersion)) {
        return;
      }

      const changelog = getChangelog(currentVersion);
      if (changelog) {
        showChangelogModal(currentVersion, changelog);
        seenVersions.push(currentVersion);
        chrome.storage.local.set({ changelogSeenVersions: seenVersions });
      }
    });
  }

  function showChangelogModal(version, changelog) {
    const modal = document.getElementById('changelog-modal');
    const versionEl = document.getElementById('changelog-version');
    const contentEl = document.getElementById('changelog-content');
    const okBtn = document.getElementById('changelog-ok-btn');

    if (!modal || !versionEl || !contentEl || !okBtn) return;

    versionEl.textContent = `Versão ${version} - ${changelog.date}`;

    const ul = document.createElement('ul');
    changelog.changes.forEach((change) => {
      const li = document.createElement('li');
      li.textContent = change;
      ul.appendChild(li);
    });
    contentEl.innerHTML = '';
    contentEl.appendChild(ul);

    modal.style.display = 'flex';

    okBtn.onclick = () => {
      modal.style.display = 'none';
    };

    const overlay = modal.querySelector('.changelog-modal-overlay');
    if (overlay) {
      overlay.onclick = () => {
        modal.style.display = 'none';
      };
    }
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  let currentHostname = null;
  if (tab?.url) {
    const url = new URL(tab.url);
    currentHostname = url.hostname.replace(/^www\./, '');
  }

  const dynamicSubtitle = document.getElementById('dynamic-subtitle');
  const subtitleHint = document.getElementById('subtitle-hint');

  if (currentHostname && CONFIG.isLigaSite(currentHostname)) {
    CONFIG.applyTheme(currentHostname);
    const siteName = CONFIG.getSiteName(currentHostname);
    const gameName = CONFIG.getGameName(currentHostname);
    const siteConfig = CONFIG.LIGA_SITES[currentHostname];
    const supportsEditionParam = siteConfig?.supportsEditionParam || false;

    if (dynamicSubtitle) {
      dynamicSubtitle.innerHTML = `Buscando preços de cartas de <b>${gameName}</b> na <b>${siteName}</b>`;
    }
    if (subtitleHint) {
      subtitleHint.style.display = 'block';
    }

    const decklistLabel = document.getElementById('decklist-label');
    if (decklistLabel) {
      if (supportsEditionParam) {
        decklistLabel.innerHTML =
          'Cole sua decklist:<br/><sup><i>(uma carta por linha; múltiplas edições da mesma carta contam separadamente)</i></sup>';
      } else {
        decklistLabel.innerHTML =
          'Cole sua decklist:<br/><sup><i>(uma carta por linha; múltiplas edições da mesma carta contam como uma única carta)</i></sup>';
      }
    }
  } else {
    if (dynamicSubtitle) {
      dynamicSubtitle.textContent = 'Abra um site da Liga para começar';
    }
    if (subtitleHint) {
      subtitleHint.style.display = 'none';
    }

    const decklistLabel = document.getElementById('decklist-label');
    if (decklistLabel) {
      decklistLabel.textContent = 'Cole sua decklist (uma carta por linha):';
    }
  }

  chrome.storage.local.get(['acceptedSites'], (result) => {
    const acceptedSites = result.acceptedSites || [];
    const isOnLigaSite = currentHostname && CONFIG.isLigaSite(currentHostname);
    const hasAcceptedForSite =
      currentHostname && acceptedSites.includes(currentHostname);

    if (isOnLigaSite && hasAcceptedForSite) {
      showScreen('main');
      initMainInterface();
    } else if (isOnLigaSite && !hasAcceptedForSite) {
      showScreen('terms');
    } else {
      showScreen('warning');
    }

    checkVersionUpdate();
  });

  if (acceptTermsBtn) {
    acceptTermsBtn.addEventListener('click', async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab?.url) {
        showScreen('warning');
        return;
      }

      const url = new URL(tab.url);
      const hostname = url.hostname.replace(/^www\./, '');

      if (!CONFIG.isLigaSite(hostname)) {
        showScreen('warning');
        return;
      }

      chrome.storage.local.get(['acceptedSites'], (result) => {
        const acceptedSites = result.acceptedSites || [];
        if (!acceptedSites.includes(hostname)) {
          acceptedSites.push(hostname);
          chrome.storage.local.set({ acceptedSites }, () => {
            showScreen('main');
            initMainInterface();
            checkVersionUpdate();
          });
        } else {
          showScreen('main');
          initMainInterface();
          checkVersionUpdate();
        }
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
    const lineCounter = document.getElementById('line-counter');

    const MAX_FILE_SIZE = 50 * 1024; // 50KB in bytes

    function updateLineCounter() {
      if (!lineCounter) return;

      const text = decklistInput.value;
      const lines = text.split('\n').filter((line) => line.trim());
      const lineCount = lines.length;

      lineCounter.textContent = `${lineCount} linhas`;
    }

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

    async function validateCardCount(deckText) {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      let hostname = null;
      if (tab?.url) {
        const url = new URL(tab.url);
        hostname = url.hostname.replace(/^www\./, '');
      }

      const siteConfig = hostname ? CONFIG.LIGA_SITES[hostname] : null;
      const countEditionsSeparately = siteConfig?.supportsEditionParam || false;

      const cardCount = FileHandler.countCards(
        deckText,
        countEditionsSeparately
      );
      if (cardCount > CONFIG.MAX_UNIQUE_CARDS) {
        const siteName = siteConfig?.name || 'este site';
        const countType = countEditionsSeparately
          ? 'cartas (incluindo diferentes edições)'
          : 'cartas únicas';
        showAlert(
          `A decklist contém ${cardCount} ${countType}. O limite máximo é ${CONFIG.MAX_UNIQUE_CARDS} cartas. Por favor, reduza a quantidade de cartas.`
        );
        return false;
      }
      return true;
    }

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          showAlert(
            `O arquivo é muito grande (${(file.size / 1024).toFixed(
              1
            )}KB). O tamanho máximo permitido é 50KB.`
          );
          fileInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          validateCardCount(fileContent).then((isValid) => {
            if (isValid) {
              decklistInput.value = fileContent;
              updateLineCounter();
            } else {
              fileInput.value = '';
            }
          });
        };
        reader.readAsText(file);
      }
    });

    decklistInput.addEventListener('input', updateLineCounter);
    decklistInput.addEventListener('paste', () => {
      setTimeout(updateLineCounter, 0);
    });

    updateLineCounter();

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

      if (!(await validateCardCount(decklistText))) {
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

      logContent.textContent = '';
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
        addLog(
          `Configurado para processar ${batchSize} carta(s) em paralelo...`,
          'info'
        );

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
