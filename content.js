function aplicarVolumePersistente() {
    try {

        if (typeof chrome !== 'undefined' && chrome.runtime?.id && chrome.storage?.local) {
            chrome.storage.local.get(['lastVolume'], (result) => {

                if (chrome.runtime.lastError) return;

                const volumeSalvo = result.lastVolume !== undefined ? result.lastVolume : 0.5;
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



const observer = new MutationObserver(() => {
    try {
        if (typeof chrome !== 'undefined' && chrome.runtime?.id) {
            
            aplicarVolumePersistente();

            // Só aplica lógica de UI se estiver ativado no storage
            chrome.storage.local.get(['controlesAtivos'], (result) => {
                if (result.controlesAtivos !== false) {
                    aplicarLogicaDeControle();
                    subirDivs();
                }
            });
        }
    } catch (e) { }
});


observer.observe(document.body, { childList: true, subtree: true });
