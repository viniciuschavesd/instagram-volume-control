const carregarEstilosExternos = () => {
    // Se já existir a tag, não adiciona de novo
    if (document.getElementById('estilo-volume-custom')) return;

    const cssBruto = `
        /* Seleciona divs que tenham z-index 999 ou 9999 no atributo style */
        div[style*="z-index: 999"], 
        div[style*="z-index: 9999"] {
            opacity: 0.3 !important;
            transition: opacity 0.3s ease-in-out !important;
        }

        /* Quando o mouse entra no post ou na própria div, volta a opacidade total */
        article:hover div[style*="z-index: 999"],
        article:hover div[style*="z-index: 9999"],
        div._aa8k:hover div[style*="z-index: 999"],
        div._aa8k:hover div[style*="z-index: 9999"],
        div[style*="z-index: 999"]:hover,
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

const subirDivs = () => {
    if (window.location.pathname.includes('/reels/') || window.location.pathname.includes('/reel/')) {
        return;
    }

    const classesParaMover = [
        // ÍNDICE 0: Pessoas Marcadas (Esquerda)
        'x1m7ywf0 x12ol6y4 x180vkcf x1khw62d x709u02 x972fbf x10w94by x1qhh985 x14e42zd x1ypdohk x14vqqas xbmvrgn xod5an3 x1diwwjn x13dflua x19991ni x1ey2m1c x1o0tod x10l6tqk x1hc1fzr', 
        // ÍNDICE 1: Áudio (Direita)
        'html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x9f619 xjbqb8w x78zum5 x15mokao x1ga7v0g x16uus16 xbiv7yw x10l6tqk x1ey2m1c xtijo5x x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1'
    ];

    classesParaMover.forEach((nomeClasse, index) => {
        const elementos = document.getElementsByClassName(nomeClasse);

        Array.from(elementos).forEach(div => {
            if (div.querySelector('video')) return;

            const article = div.closest('article') || div.closest('div._aa8k');
            if (!article) return;

            const videoAtivo = article.querySelector('video');

            if (videoAtivo) {
                if (index === 0) {
                    // --- CORREÇÃO PESSOAS MARCADAS: Altura reduzida para não subir o vídeo todo ---
                    div.style.setProperty('height', 'auto', 'important'); // Em vez de calc(100% - 60px)
                    div.style.setProperty('position', 'absolute', 'important');
                    div.style.setProperty('bottom', '52px', 'important'); // Alinha perto da barra de progresso
                    div.style.setProperty('top', 'auto', 'important');
                    div.style.setProperty('left', '0', 'important');
                    div.style.setProperty('width', 'auto', 'important');
                    div.style.setProperty('pointer-events', 'none', 'important');
                    div.style.setProperty('z-index', '999', 'important');
                    div.style.setProperty('padding', '0', 'important');

                    const btnTags = div.querySelector('button');
                    if (btnTags) {
                        btnTags.style.setProperty('margin', '0', 'important'); // Zera margens nativas
                        btnTags.style.setProperty('position', 'relative', 'important');
                        btnTags.style.setProperty('left', '0px', 'important'); // Pequeno ajuste para não colar no pixel 0
                        btnTags.style.setProperty('pointer-events', 'auto', 'important');
                    }
                } 
                else if (index === 1) {
                    // --- CORREÇÃO ÁUDIO: Removendo os 12px de margem ---
                    div.style.setProperty('height', '52px', 'important');
                    div.style.setProperty('position', 'absolute', 'important');
                    div.style.setProperty('bottom', '52px', 'important');
                    div.style.setProperty('top', 'auto', 'important');
                    div.style.setProperty('right', '0', 'important');
                    div.style.setProperty('width', '52px', 'important');
                    div.style.setProperty('pointer-events', 'none', 'important');
                    div.style.setProperty('z-index', '999', 'important');

                    const btnAudio = div.querySelector('button[aria-label*="áudio"], button[aria-label*="Audio"]');
                    if (btnAudio) {
                        // O segredo está aqui: forçar margin 0 e usar right para posicionar
                        btnAudio.style.setProperty('margin', '0', 'important'); 
                        btnAudio.style.setProperty('margin-right', '0px', 'important'); // Mata os 12px da image_4ef399
                        btnAudio.style.setProperty('position', 'relative', 'important');
                        btnAudio.style.setProperty('right', '0px', 'important'); 
                        btnAudio.style.setProperty('pointer-events', 'auto', 'important');
                        btnAudio.style.setProperty('transform', 'none', 'important');
                    }
                }
            } else {
                div.style.removeProperty('height');
                div.style.removeProperty('position');
                div.style.removeProperty('bottom');
            }
        });
    });
};


const aplicarLogicaDeControle = () => {
    // Buscamos todos os vídeos na página (Instagram usa muitos vídeos dinâmicos)
    document.querySelectorAll('video').forEach(video => {

        // 1. Ativa os controles nativos se estiverem desligados
        if (!video.controls) {
            video.controls = true;
        }

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

const subirDivsReels = () => {
    if (!window.location.pathname.includes('/reels/')) return;

    const classesReels = [
        'x191j7n5 xdg88n9 x10l6tqk x1vjfegm',
        'x78zum5 xdt5ytf xr1yuqi x6ikm8r x10wlt62 xgpatz3'
    ];

    classesReels.forEach(nomeClasse => {
        const elementos = document.getElementsByClassName(nomeClasse);

        if (elementos.length > 0) {

            const position = (nomeClasse === 'x191j7n5 xdg88n9 x10l6tqk x1vjfegm') ? '9999' : '9998';

            Array.from(elementos).forEach(div => {

                if (div.style.transform !== 'translateY(-60px)') {
                    div.style.setProperty('transform', 'translateY(-60px)', 'important');
                    div.style.setProperty('z-index', position, 'important');
                    div.style.setProperty('pointer-events', 'auto', 'important');
                }
            });
        }
    });
};
