const subirDivs = () => {
    // Liste aqui os nomes das classes EXATOS
    const classesParaMover = ['x1m7ywf0 x12ol6y4 x180vkcf x1khw62d x709u02 x972fbf x10w94by x1qhh985 x14e42zd x1ypdohk x14vqqas xbmvrgn xod5an3 x1diwwjn x13dflua x19991ni x1ey2m1c x1o0tod x10l6tqk x1hc1fzr', 'html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x9f619 xjbqb8w x78zum5 x15mokao x1ga7v0g x16uus16 xbiv7yw x10l6tqk x1ey2m1c xtijo5x x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1'];

    classesParaMover.forEach(nomeClasse => {
        // Buscamos os elementos de cada classe individualmente
        const elementos = document.getElementsByClassName(nomeClasse);

        if (elementos.length > 0) {
            // Convertemos para Array para garantir o forEach
            Array.from(elementos).forEach(div => {
                // console.log(`Movendo div da classe: ${nomeClasse}`);
                const temVideoNoContexto = div.closest('article')?.querySelector('video') ||
                    div.closest('div._aa8k')?.querySelector('video');

                if (temVideoNoContexto) {
                    // Se for vídeo, aplica o movimento original
                    div.style.setProperty('transform', 'translateY(-60px)', 'important');
                    div.style.setProperty('z-index', '9999', 'important');
                    div.style.setProperty('pointer-events', 'auto', 'important');

                } else {
                    // Se for imagem (não achou vídeo), garantimos que o transform seja resetado
                    // Isso evita que posts de imagem fiquem bugados
                    div.style.removeProperty('transform');
                }
            });
        }
    });
};

const aplicarLogicaDeControle = () => {
    // Buscamos todos os vídeos na página (Instagram usa muitos vídeos dinâmicos)
    document.querySelectorAll('video').forEach(video => {

        // 1. Ativa os controles nativos se estiverem desligados
        if (!video.controls) {
            video.controls = true;
        }

        // 2. Traz o vídeo para a frente para o mouse conseguir interagir (Z-INDEX MÁXIMO)
        // Isso garante que o hover funcione sem precisar de CSS externo
        if (video.style.zIndex !== '998') {
            video.style.setProperty('z-index', '998', 'important');
            video.style.setProperty('position', 'relative', 'important');
            video.style.setProperty('pointer-events', 'auto', 'important');
        }

        // 3. Desativa as camadas de "clique" do Instagram que ficam em cima do vídeo
        let camadaPai = video.parentElement;
        for (let i = 0; i < 5; i++) {
            if (!camadaPai || camadaPai === document.body) break;

            // Se a camada tiver posição absoluta, ela bloqueia o seu mouse
            const cssPai = window.getComputedStyle(camadaPai);
            if (cssPai.position === 'absolute' || cssPai.position === 'fixed') {
                camadaPai.style.setProperty('pointer-events', 'none', 'important');
            }
            camadaPai = camadaPai.parentElement;
        }
    });
};

const carregarEstilosExternos = () => {
    const cssBruto = `
        div[style*="z-index: 9999"] {
            opacity: 0.3 !important;
            transition: opacity 0.3s ease-in-out !important;
        }

        article:hover div[style*="z-index: 9999"],
        div._aa8k:hover div[style*="z-index: 9999"],
        div[style*="z-index: 9999"]:hover {
            opacity: 1 !important;
        }
    `;

    const styleTag = document.createElement('style');
    styleTag.id = 'estilo-volume-custom';
    styleTag.textContent = cssBruto;
    
    document.head.appendChild(styleTag);

};

carregarEstilosExternos();