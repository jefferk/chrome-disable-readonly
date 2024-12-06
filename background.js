chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get({ disabledUrls: [] }, (data) => {
      const disabledUrls = data.disabledUrls;
      if (disabledUrls.includes(tab.url)) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: disableReadonlyInputs
        });
      }
    });
  }
});

function disableReadonlyInputs() {
  const inputs = document.querySelectorAll('input[readonly]');
  inputs.forEach(input => {
    input.dataset.originalReadonly = true;
    input.removeAttribute('readonly');
  });
}

function enableReadonlyInputs() {
  const inputs = document.querySelectorAll('input[data-original-readonly]');
  inputs.forEach(input => {
    input.setAttribute('readonly', 'true');
    delete input.dataset.originalReadonly;
  });
}