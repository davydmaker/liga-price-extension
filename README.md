# LigaPrice

Uma extensão de código aberto que facilita a busca e organização de preços de cartas através de todas as lojas da Liga.

## Índice

- [Sobre](#sobre)
- [Sites Suportados](#sites-suportados)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Formato da Decklist](#formato-da-decklist)
- [Limitações Técnicas](#limitações-técnicas)
- [Avisos Importantes](#avisos-importantes)
- [Privacidade](#privacidade)
- [Desenvolvimento](#desenvolvimento)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Sobre

LigaPrice é uma extensão desenvolvida para facilitar a busca de preços de cartas em todas as lojas da Liga. A extensão permite processar listas de cartas em paralelo, gerar arquivos CSV com os preços encontrados e acompanhar o progresso em tempo real.

## Sites Suportados

A extensão funciona nos seguintes sites da Liga:

- **LigaMagic** - Magic: The Gathering
- **LigaPokemon** - Pokémon TCG
- **LigaYuGiOh** - Yu-Gi-Oh!
- **LigaOnePiece** - One Piece Card Game
- **LigaFAB** - Flesh and Blood
- **LigaLorcana** - Disney Lorcana
- **LigaDragonBall: Masters** - Dragon Ball Super Card Game (Masters)
- **LigaDragonBall: Fusion** - Dragon Ball Super Card Game (Fusion)
- **LigaVanguard** - Cardfight!! Vanguard
- **LigaStarWars** - Star Wars: Unlimited
- **LigaDigimon** - Digimon Card Game

## Funcionalidades

- **Suporte para múltiplas lojas**: Funciona em todos os sites da Liga
- **Processamento paralelo**: Configure quantas cartas processar simultaneamente (máximo 5)
- **Exportação CSV**: Gere arquivos CSV com os preços encontrados (mínimo, médio e máximo)
- **Suporte a edições**: Especifique edições específicas usando colchetes
- **Temas dinâmicos**: Interface se adapta automaticamente às cores do site da Liga aberto
- **Logs em tempo real**: Acompanhe o progresso do processamento com logs detalhados
- **Contador de linhas**: Visualize a quantidade de linhas da sua decklist em tempo real
- **Upload de arquivo**: Suporte para upload de arquivos .txt (máximo 50KB)
- **Interface intuitiva**: Interface simples e fácil de usar

## Instalação

### Chrome Web Store

A extensão está disponível na [Chrome Web Store](https://chromewebstore.google.com/detail/igeoigegdibogimgagjbcbcjnnjcbjig).

### Instalação Manual

1. Clone ou baixe este repositório
2. Abra o Chrome e acesse `chrome://extensions/`
3. Ative o "Modo do desenvolvedor" no canto superior direito
4. Clique em "Carregar sem compactação"
5. Selecione a pasta deste repositório

## Como Usar

1. **Abra um site da Liga**: Navegue até qualquer site da Liga suportado (ex: www.ligamagic.com.br)
2. **Abra a extensão**: Clique no ícone da extensão na barra de ferramentas
3. **Cole sua decklist**: Cole sua lista de cartas (uma por linha) ou selecione um arquivo .txt
4. **Configure o processamento**: Defina quantas cartas processar em paralelo (1-5)
5. **Processe**: Clique em "Processar" e aguarde
6. **Baixe o CSV**: Após o processamento, clique em "Baixar CSV" para obter os resultados

**Nota**: A extensão só funciona quando você está navegando em um site da Liga. Se você abrir a extensão em outro site, será apresentada uma tela com botões para abrir cada loja suportada.

## Formato da Decklist

Uma carta por linha, opcionalmente com edição entre colchetes:

```
Lightning Bolt [M21]
Lightning Bolt [M10]
Counterspell
Sol Ring [UNH]
Vaporeon [JU-JP]
```

### Contagem de Edições

A forma como múltiplas edições são contadas varia por site:

**Sites que contam edições separadamente** (múltiplas edições = múltiplas cartas):
- LigaPokemon
- LigaOnePiece
- LigaStarWars
- LigaDigimon
- LigaLorcana
- LigaDragonBall (Masters e Fusion)
- LigaVanguard

**Sites que contam apenas o nome** (múltiplas edições = uma carta):
- LigaMagic
- LigaFAB
- LigaYuGiOh

## Limitações Técnicas

Para garantir uso responsável e evitar sobrecarga nos servidores:

- **Máximo de 100 cartas únicas** por processamento (ou mais, dependendo de como as edições são contadas por site)
- **Máximo de 5 cartas processadas em paralelo** (configurável entre 1 e 5)
- **Delays automáticos** entre requisições (300ms entre requisições individuais, 1s entre grupos)
- **Sleep progressivo** após múltiplos grupos processados
- **Tratamento automático de erros 429** (Too Many Requests) com retry
- **Timeout de 30 segundos** por requisição
- **Limite de arquivo**: Máximo de 50KB para upload de arquivos

## Avisos Importantes

**Esta extensão NÃO é oficial** e não possui afiliação com nenhuma das lojas da Liga.

**O uso desta ferramenta pode violar os Termos e Condições Gerais de Uso das lojas da Liga**, podendo resultar em:

- Suspensão ou cancelamento de cadastro nas lojas da Liga
- Bloqueio de acesso aos sites
- Ações legais por parte das lojas da Liga

**Você assume total responsabilidade** pelo uso desta extensão.

**Mantenha a janela aberta**: Durante o processamento, mantenha a janela da extensão aberta e não troque de guia para não perder o progresso.

Leia o [aviso legal completo](legal.html) antes de usar.

## Privacidade

- Todos os dados processados permanecem **localmente** no seu dispositivo
- Nenhum dado é enviado para servidores externos
- Nenhum dado é compartilhado com terceiros
- A extensão não coleta informações pessoais
- Apenas preferências locais são salvas:
  - Aceitação de termos de uso por site
  - Tamanho do lote (batch size) configurado
  - Versões do changelog visualizadas
- A extensão verifica apenas o hostname da aba atual para determinar qual site da Liga está aberto (esta informação não é armazenada ou transmitida)

## Desenvolvimento

### Estrutura do Projeto

```
liga-price-extension/
├── css/
│   └── styles.css          # Estilos da interface
├── js/
│   ├── batchProcessor.js   # Processamento em lotes
│   ├── changelog.js        # Histórico de versões
│   ├── config.js           # Configurações e sites suportados
│   ├── fileHandler.js      # Manipulação de arquivos
│   ├── htmlParser.js       # Parser HTML
│   ├── legal.js            # Script da página legal
│   ├── popup.js            # Lógica principal do popup
│   ├── priceExtractor.js   # Extração de preços
│   ├── scraper.js          # Web scraping
│   └── utils.js            # Utilitários
├── icons/                  # Ícones da extensão
├── .github/                # Templates e workflows
├── legal.html              # Aviso legal completo
├── manifest.json           # Manifest da extensão
└── popup.html              # Interface principal
```

### Tecnologias

- JavaScript (ES6+)
- Chrome Extension Manifest V3
- HTML5/CSS3

### Requisitos

- Chrome/Edge/Brave (navegadores baseados em Chromium)
- Versão mínima do Chrome: 88+

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Leia o [Código de Conduta](.github/CODE_OF_CONDUCT.md)
2. Consulte o [Guia de Contribuição](.github/CONTRIBUTING.md)
3. Abra uma issue para discutir mudanças significativas
4. Faça um fork, crie uma branch e envie um pull request

Para reportar bugs ou sugerir melhorias, consulte o [Guia de Suporte](.github/SUPPORT.md).

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Links

- [Repositório no GitHub](https://github.com/davydmaker/liga-price-extension)
- [Reportar um Bug](https://github.com/davydmaker/liga-price-extension/issues/new?template=bug_report.md)
- [Sugerir uma Funcionalidade](https://github.com/davydmaker/liga-price-extension/issues/new?template=feature_request.md)

---

**Desenvolvido para a comunidade de jogadores de TCG**
