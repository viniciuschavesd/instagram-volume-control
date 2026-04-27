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
        }
    } catch (e) {}
});
observer.observe(document.body, { childList: true, subtree: true });