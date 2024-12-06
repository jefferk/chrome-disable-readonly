document.addEventListener("DOMContentLoaded", () => {
  const disableBtn = document.getElementById("disableReadonlyBtn");
  const enableBtn = document.getElementById("enableReadonlyBtn");
  const statusDiv = document.getElementById("status");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    chrome.storage.sync.get({ disabledUrls: [] }, (data) => {
      if (data.disabledUrls.includes(currentTab.url)) {
        chrome.scripting.executeScript(
          {
            target: { tabId: currentTab.id },
            function: disableReadonlyInputs,
          },
          () => {
            statusDiv.textContent = "Readonly esta deshabilitado";
            statusDiv.style.color = "red";
            disableBtn.style.display = "none";
            enableBtn.style.display = "block";
          }
        );
      } else {
        statusDiv.textContent = "";
        disableBtn.style.display = "block";
        enableBtn.style.display = "none";
      }
    });
  });

  disableBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: disableReadonlyInputs,
        },
        () => {
          saveCurrentUrl(currentTab.url);
          statusDiv.textContent = "Readonly esta deshabilitado";
          statusDiv.style.color = "red";
          disableBtn.style.display = "none";
          enableBtn.style.display = "block";
        }
      );
    });
  });

  enableBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: enableReadonlyInputs,
        },
        () => {
          removeCurrentUrl(currentTab.url);
          statusDiv.textContent = "";
          disableBtn.style.display = "block";
          enableBtn.style.display = "none";
        }
      );
    });
  });
});

function disableReadonlyInputs() {
  const inputs = document.querySelectorAll("input[readonly]");
  inputs.forEach((input) => {
    input.dataset.originalReadonly = true;
    input.removeAttribute("readonly");
  });
}

function enableReadonlyInputs() {
  location.reload();
  const inputs = document.querySelectorAll("input[data-original-readonly]");
  inputs.forEach((input) => {
    input.setAttribute("readonly", "true");
    delete input.dataset.originalReadonly;
  });
}

function saveCurrentUrl(url) {
  chrome.storage.sync.get({ disabledUrls: [] }, (data) => {
    const disabledUrls = data.disabledUrls;
    if (!disabledUrls.includes(url)) {
      disabledUrls.push(url);
      chrome.storage.sync.set({ disabledUrls: disabledUrls });
    }
  });
}

function removeCurrentUrl(url) {
  chrome.storage.sync.get({ disabledUrls: [] }, (data) => {
    const disabledUrls = data.disabledUrls;
    const index = disabledUrls.indexOf(url);
    if (index > -1) {
      disabledUrls.splice(index, 1);
      chrome.storage.sync.set({ disabledUrls: disabledUrls });
    }
  });
}
