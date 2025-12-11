# Suporte - LigaPrice Extension

Obrigado por usar a LigaPrice! Este documento fornece informações sobre como obter ajuda e suporte.

## Antes de Pedir Ajuda

Antes de reportar um problema ou pedir ajuda, por favor:

1. **Verifique se o problema já foi reportado** - Procure nas [Issues](https://github.com/davydmaker/liga-price-extension/issues) existentes
2. **Leia a documentação** - Verifique o README e outros documentos do projeto
3. **Teste em diferentes sites** - O problema pode ser específico de um site da Liga
4. **Verifique sua versão** - Certifique-se de estar usando a versão mais recente da extensão

## Reportar Problemas

Se você encontrou um bug ou problema:

### Como Reportar

1. Vá para a página de [Issues](https://github.com/davydmaker/liga-price-extension/issues)
2. Clique em "New Issue"
3. Selecione o template apropriado (Bug Report)
4. Preencha todas as informações solicitadas

### Informações Necessárias

Ao reportar um problema, inclua:

- **Descrição clara do problema**
- **Passos para reproduzir** o problema
- **Comportamento esperado** vs **comportamento atual**
- **Screenshots** (se aplicável)
- **Informações do ambiente**:
  - Navegador e versão (ex: Chrome 120.0.6099.129)
  - Versão da extensão (encontrada em `chrome://extensions/`)
  - Sistema operacional
  - Site da Liga onde o problema ocorreu
- **Mensagens de erro** (se houver)

### Exemplo de Reporte

```
**Descrição:**
A extensão não processa cartas quando estou no site LigaPokemon.

**Passos para Reproduzir:**
1. Abrir o site ligapokemon.com.br
2. Abrir a extensão LigaPrice
3. Colar uma decklist
4. Clicar em "Processar"
5. Ver erro: "Site da Liga não detectado"

**Comportamento Esperado:**
A extensão deveria detectar o site LigaPokemon e processar as cartas.

**Comportamento Atual:**
Mostra erro dizendo que o site não foi detectado.

**Ambiente:**
- Navegador: Chrome 120.0.6099.129
- Versão da Extensão: 1.1.0
- Sistema Operacional: Windows 11
- Site: ligapokemon.com.br
```

## Sugerir Funcionalidades

Temos prazer em receber sugestões de melhorias! Para sugerir uma nova funcionalidade:

1. Vá para [Issues](https://github.com/davydmaker/liga-price-extension/issues)
2. Clique em "New Issue"
3. Selecione "Feature Request"
4. Descreva a funcionalidade proposta e seus benefícios

## Perguntas Frequentes (FAQ)

### A extensão não funciona em um site da Liga

**Verifique:**
- Você está realmente em um site da Liga suportado?
- O site está carregado completamente?
- Tente recarregar a página e abrir a extensão novamente

**Sites suportados:**
- LigaMagic (ligamagic.com.br)
- LigaPokemon (ligapokemon.com.br)
- LigaYuGiOh (ligayugioh.com.br)
- LigaVanguard (ligavanguard.com.br)
- LigaFAB (ligafab.com.br)
- LigaDragonBall Masters (masters.ligadragonball.com.br)
- LigaDragonBall Fusion (fusion.ligadragonball.com.br)

### A extensão não detecta o site atual

**Solução:**
- Certifique-se de estar navegando em um dos sites suportados
- Recarregue a página do site da Liga
- Feche e reabra a extensão
- Verifique se a URL está correta (sem www. ou com www.)

### Erro ao processar cartas

**Possíveis causas:**
- Site da Liga temporariamente indisponível
- Problema de conexão com a internet
- Formato da decklist incorreto
- Limite de requisições atingido (aguarde alguns minutos)

**Soluções:**
- Verifique sua conexão com a internet
- Tente novamente após alguns minutos
- Verifique o formato da sua decklist
- Tente processar menos cartas por vez (reduza o batch size)

### Download do CSV não funciona

**Verifique:**
- O processamento foi concluído com sucesso?
- Você tem permissão para baixar arquivos no navegador?
- Verifique as configurações de download do Chrome

### A extensão está lenta

**Possíveis causas:**
- Muitas cartas sendo processadas
- Site da Liga com resposta lenta
- Múltiplas requisições simultâneas

**Soluções:**
- Reduza o tamanho do batch (quantidade processada em paralelo)
- Processe menos cartas por vez
- Aguarde alguns minutos entre processamentos

### Como atualizar a extensão?

**Se instalada do Chrome Web Store:**
- A extensão atualiza automaticamente
- Você pode verificar atualizações em `chrome://extensions/` e clicar em "Atualizar"

**Se instalada manualmente:**
- Baixe a versão mais recente do repositório
- Recarregue a extensão em `chrome://extensions/`

### A extensão viola os termos das lojas da Liga?

**Importante:**
- Esta extensão utiliza técnicas de web scraping que podem violar os termos de uso das lojas da Liga
- O uso é por sua conta e risco
- Leia o [Aviso Legal](legal.html) completo antes de usar
- Recomendamos usar com moderação e respeitar os limites de requisições

## Recursos Úteis

- **Repositório GitHub**: [liga-price-extension](https://github.com/davydmaker/liga-price-extension)
- **Issues**: [Reportar problemas ou sugerir funcionalidades](https://github.com/davydmaker/liga-price-extension/issues)
- **Código de Conduta**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Guia de Contribuição**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Aviso Legal**: Disponível na extensão (botão "Ver aviso legal completo")

## Contato

Para questões que não foram resolvidas aqui:

1. **Abra uma Issue no GitHub** - Para bugs e sugestões de funcionalidades
2. **Verifique a documentação** - README e outros arquivos do projeto
3. **Revise Issues existentes** - Sua dúvida pode já ter sido respondida

## Limitações Conhecidas

- A extensão depende da estrutura HTML dos sites da Liga, que pode mudar
- Processamento de muitas cartas pode levar tempo
- Alguns sites podem ter limites de requisições
- A extensão não armazena dados pessoais ou histórico de buscas

## Ainda Precisa de Ajuda?

Se você ainda não encontrou a resposta que procura:

1. Procure nas [Issues](https://github.com/davydmaker/liga-price-extension/issues) existentes
2. Abra uma nova Issue com todas as informações relevantes
3. Seja específico e forneça o máximo de detalhes possível

---

**Nota**: Este é um projeto de código aberto mantido pela comunidade. Respostas podem levar algum tempo dependendo da disponibilidade dos mantenedores.
