const CHANGELOG = {
  '1.2.0': {
    date: '2025-12-12',
    changes: [
      'Suporte para todos os sites da Liga (Magic, Pokemon, YuGiOh, FAB, Lorcana, DragonBall, Vanguard, StarWars, Digimon)',
      'Temas dinâmicos baseados no site ativo',
      'Contador de linhas em tempo real',
      'Limite de tamanho de arquivo (50KB)',
      'Timeout de 30 segundos em requisições',
      'Melhor tratamento de erros de rede',
      'Melhorias de acessibilidade no documento legal',
      'Expansão da seção de privacidade no documento legal com mais detalhes sobre armazenamento local',
      'Expansão da seção de suporte no documento legal com links e informações sobre o projeto'
    ]
  }
};

function getChangelog(version) {
  return CHANGELOG[version] || null;
}
