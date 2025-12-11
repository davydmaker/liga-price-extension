# Guia de Contribuição - LigaPrice Extension

Obrigado por considerar contribuir com a extensão LigaPrice! Este documento fornece diretrizes e informações sobre como contribuir para o projeto.

## Código de Conduta

Este projeto adere ao nosso [Código de Conduta](CODE_OF_CONDUCT.md). Ao participar, você concorda em manter este código.

## Como Posso Contribuir?

### Reportar Bugs

Se você encontrou um bug, por favor:

1. **Verifique se o bug já foi reportado** - Procure nas [Issues](https://github.com/davydmaker/liga-price-extension/issues) existentes
2. **Crie uma nova issue** se o bug não foi reportado, incluindo:
   - Descrição clara do problema
   - Passos para reproduzir o bug
   - Comportamento esperado vs comportamento atual
   - Screenshots (se aplicável)
   - Informações do ambiente:
     - Navegador e versão (ex: Chrome 120.0)
     - Versão da extensão
     - Site da Liga onde o problema ocorreu

### Sugerir Funcionalidades

Temos prazer em receber sugestões de melhorias! Para sugerir uma nova funcionalidade:

1. **Verifique se já existe uma sugestão similar** nas [Issues](https://github.com/davydmaker/liga-price-extension/issues)
2. **Crie uma nova issue** com o label "enhancement", incluindo:
   - Descrição clara da funcionalidade proposta
   - Casos de uso e benefícios
   - Exemplos de como funcionaria
   - Considerações técnicas (se aplicável)

### Contribuir com Código

#### Configuração do Ambiente de Desenvolvimento

1. **Clone o repositório**
   ```bash
   git clone https://github.com/davydmaker/liga-price-extension.git
   cd liga-price-extension/extension
   ```

2. **Carregue a extensão no Chrome**
   - Abra `chrome://extensions/`
   - Ative o "Modo do desenvolvedor"
   - Clique em "Carregar sem compactação"
   - Selecione a pasta `extension/`

3. **Faça suas alterações**
   - Crie uma branch para sua feature/fix: `git checkout -b minha-feature`
   - Faça suas alterações
   - Teste localmente

#### Estrutura do Projeto

```
extension/
├── .github/          # Arquivos do GitHub (CODE_OF_CONDUCT, CONTRIBUTING)
├── css/              # Estilos CSS
│   └── styles.css
├── icons/            # Ícones da extensão
├── js/               # Código JavaScript
│   ├── batchProcessor.js  # Processamento em lotes
│   ├── config.js         # Configurações e temas
│   ├── fileHandler.js    # Manipulação de arquivos
│   ├── htmlParser.js     # Parser HTML
│   ├── legal.js          # Lógica da página legal
│   ├── popup.js          # Lógica principal do popup
│   ├── priceExtractor.js # Extração de preços
│   ├── scraper.js        # Web scraping
│   └── utils.js          # Utilitários
├── legal.html        # Página de aviso legal
├── manifest.json     # Manifest da extensão (Chrome)
└── popup.html        # Interface principal
```

#### Padrões de Código

- **JavaScript**: Use ES6+ (classes, arrow functions, async/await)
- **Formatação**: O projeto usa Prettier (veja `.prettierrc`)
- **Nomenclatura**:
  - Variáveis e funções: `camelCase`
  - Classes: `PascalCase`
  - Constantes: `UPPER_SNAKE_CASE`
- **Comentários**: Em inglês para código, português para mensagens ao usuário
- **Mensagens ao usuário**: Sempre em português

#### Exemplo de Estrutura de Código

```javascript
// Classe utilitária
class Utils {
  static async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Função assíncrona
async function fetchData() {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw error;
  }
}
```

#### Processo de Pull Request

1. **Crie uma branch** a partir de `main`
   ```bash
   git checkout -b feature/minha-feature
   ```

2. **Faça suas alterações**
   - Siga os padrões de código
   - Adicione comentários quando necessário
   - Teste suas alterações

3. **Commit suas alterações**
   - Use mensagens de commit descritivas
   - Exemplo: `feat: adiciona suporte para novo site da Liga`
   - Prefixos comuns: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`

4. **Push para o repositório**
   ```bash
   git push origin feature/minha-feature
   ```

5. **Abra um Pull Request**
   - Descreva claramente o que foi alterado
   - Referencie issues relacionadas (ex: "Fixes #123")
   - Adicione screenshots se houver mudanças visuais
   - Aguarde revisão

#### Checklist para Pull Requests

- [ ] Código segue os padrões do projeto
- [ ] Alterações foram testadas localmente
- [ ] Mensagens ao usuário estão em português
- [ ] Comentários no código estão em inglês
- [ ] Não há erros de lint
- [ ] Documentação atualizada (se necessário)
- [ ] Código de conduta seguido

### Testando a Extensão

Antes de submeter um PR, certifique-se de:

1. **Testar em diferentes sites da Liga**
   - LigaMagic
   - LigaPokemon
   - LigaYuGiOh
   - LigaVanguard
   - LigaFAB
   - LigaDragonBall (Masters e Fusion)

2. **Verificar temas**
   - Cada site deve aplicar seu tema corretamente
   - Cores devem estar consistentes

3. **Testar funcionalidades principais**
   - Upload de decklist
   - Processamento de cartas
   - Download de CSV
   - Cancelamento de processamento
   - Validações de entrada

4. **Verificar em diferentes navegadores** (se possível)
   - Chrome (principal)
   - Edge (Chromium)

### Adicionar Suporte para Novos Sites

Se você quiser adicionar suporte para um novo site da Liga:

1. **Adicione a configuração em `js/config.js`**:
   ```javascript
   "novosite.com.br": {
     name: "Nome do Site",
     gameName: "Nome do Jogo",
     template: "https://novosite.com.br/?view=cards/card&card={card_name}",
     theme: {
       primary: "#cor-primaria",
       primaryHover: "#cor-hover",
       secondary: "#cor-secundaria",
       secondaryHover: "#cor-secundaria-hover",
       success: "#cor-sucesso",
       warning: "#cor-aviso",
     },
   }
   ```

2. **Adicione permissão em `manifest.json`**:
   ```json
   "host_permissions": [
     "https://novosite.com.br/*"
   ]
   ```

3. **Teste completamente** o novo site antes de submeter

### Questões?

Se você tiver dúvidas sobre como contribuir:

- Abra uma [Issue](https://github.com/davydmaker/liga-price-extension/issues) com a tag "question"
- Verifique a documentação existente
- Revise issues e pull requests anteriores

## Agradecimentos

Obrigado por contribuir para tornar a LigaPrice melhor!
