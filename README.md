Instagram Volume & UI Control 🎧

Uma extensão para Google Chrome desenvolvida para melhorar a experiência de interface do usuário no Instagram Web, focando no controle de volume e na limpeza visual dos elementos sobre o vídeo.

🚀 Funcionalidades
  - Reposicionamento de Controles: Move os botões de som e marcação (tags) para fora da área central do vídeo, evitando que obstruam a visão.

  - Interface Inteligente (Hover): Os controles permanecem com opacidade reduzida (10%) por padrão e tornam-se totalmente visíveis apenas quando o usuário passa o mouse sobre o post.

  - Injeção Dinâmica de CSS: Utiliza técnicas de injeção de estilos via JavaScript para contornar restrições de segurança (CSP) do Instagram.

  - Filtro Seletivo: A lógica de movimentação das divs só é aplicada em posts que contêm vídeos, preservando o layout original de fotos.

🛠️ Tecnologias Utilizadas
  - JavaScript (ES6+): Lógica de manipulação do DOM e MutationObserver.

  - CSS3: Estilização avançada com transições suaves e seletores de atributos específicos.

  - Chrome Extension API (Manifest V3): Padrão mais recente para extensões do navegador.
