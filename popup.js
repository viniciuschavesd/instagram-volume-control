const slider = document.getElementById('volumeSlider');
const display = document.getElementById('val');
const btnToggle = document.getElementById('toggleControles');

chrome.storage.local.get(['lastVolume', 'controlesAtivos'], (result) => {
    // Volume
    if (result.lastVolume !== undefined) {
        const volPercent = Math.round(result.lastVolume * 100);
        slider.value = volPercent;
        display.innerText = volPercent + "%";
    }
    
    // Botão Controles (Padrão: true)
    const ativo = result.controlesAtivos !== false; 
    atualizarBotaoUI(ativo);
});

btnToggle.addEventListener('click', () => {
    chrome.storage.local.get(['controlesAtivos'], (result) => {
        const novoEstado = !(result.controlesAtivos !== false);
        chrome.storage.local.set({ controlesAtivos: novoEstado });
        atualizarBotaoUI(novoEstado);
        
        // Recarrega a aba para aplicar/remover mudanças imediatamente para não bugar
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id);
        });
    });
});

function atualizarBotaoUI(ativo) {
    btnToggle.innerText = ativo ? "Ativado" : "Desativado";
    btnToggle.style.backgroundColor = ativo ? "#e1f5fe" : "#ffebee";
}

slider.addEventListener('input', async () => {
    const volume = slider.value / 100;
    display.innerText = slider.value + "%";

    chrome.storage.local.set({ lastVolume: volume });

    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (tab?.id) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: (vol) => {
                document.querySelectorAll('video').forEach(v => v.volume = vol);
            },
            args: [volume]
        });
    }
});