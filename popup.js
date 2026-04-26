const slider = document.getElementById('volumeSlider');
const display = document.getElementById('val');

chrome.storage.local.get(['lastVolume'], (result) => {
    if (result.lastVolume !== undefined) {
        const volPercent = Math.round(result.lastVolume * 100);
        slider.value = volPercent;
        display.innerText = volPercent + "%";
    }
});

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