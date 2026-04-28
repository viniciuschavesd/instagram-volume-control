function aplicarVolumePersistente() {
    try {

        if (typeof chrome !== 'undefined' && chrome.runtime?.id && chrome.storage?.local) {
            chrome.storage.local.get(['lastVolume'], (result) => {

                if (chrome.runtime.lastError) return;

                const volumeSalvo = result.lastVolume !== undefined ? result.lastVolume : 0.3;
                const videos = document.querySelectorAll('video');

                videos.forEach(video => {
                    if (video.volume !== volumeSalvo) {
                        video.volume = volumeSalvo;
                    }
                    if (!video.dataset.syncActive) { 
                        video.addEventListener('volumechange', () => {
                            const novoVolume = video.volume;
                            chrome.storage.local.set({ 'lastVolume': novoVolume });
                        });

                        video.dataset.syncActive = "true";
                    }
                });
            });
        }
    } catch (e) {
    }
}

aplicarVolumePersistente();

let timeoutObserver = null;

const observer = new MutationObserver(() => {
    // Limpa o agendamento anterior (Debounce)
    clearTimeout(timeoutObserver);

    // Agenda a execução para 100ms após a última mudança no DOM
    timeoutObserver = setTimeout(() => {
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime?.id) {
                
                aplicarVolumePersistente();

                chrome.storage.local.get(['controlesAtivos'], (result) => {
                    if (result.controlesAtivos !== false) {
                        aplicarLogicaDeControle();
                            
                        // Filtro de rota: decide qual função chamar sem "procurar" à toa
                        if (window.location.pathname.includes('/reels/')) {
                            subirDivsReels();
                        } else {
                            subirDivs();
                        }
                    }
                });
            }
        } catch (e) { }
    }, 100); 
});

observer.observe(document.body, { childList: true, subtree: true });

