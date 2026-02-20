let currentDPI = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "UPDATE_DPI") {

    currentDPI = message.result;

    chrome.action.setBadgeText({
  text:
    message.result.risk === "High" ? "!" :
    message.result.risk === "Moderate" ? "!" :
    ""
});

    chrome.action.setBadgeBackgroundColor({
      color:
        message.result.risk === "High" ? "#F44336" :
        message.result.risk === "Moderate" ? "#FFC107" :
        "#4CAF50"
    });

    chrome.storage.local.set({
      [message.url]: message.result
    });
  }

  if (message.type === "GET_DPI") {

  chrome.storage.local.get([message.url], (data) => {
    sendResponse({ result: data[message.url] || null });
  });

  return true; // required for async response
}

});
