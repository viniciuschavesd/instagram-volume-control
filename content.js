function aplicarVolumePersistente() {
    // Verifica se a API de storage está disponível antes de chamar
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['lastVolume'], (result) => {
            const volumeSalvo = result.lastVolume !== undefined ? result.lastVolume : 0.5;
            
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (video.volume !== volumeSalvo) {
                    video.volume = volumeSalvo;
                }
            });
        });
    }
}

const observer = new MutationObserver(() => aplicarVolumePersistente());
observer.observe(document.body, { childList: true, subtree: true });

aplicarVolumePersistente();