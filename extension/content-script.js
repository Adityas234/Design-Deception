console.log("Design Deception content script running");

function extractConsentBanner() {

  const candidates = Array.from(
    document.querySelectorAll("div, section, aside, form, dialog")
  );

  return candidates.find(el => {

    const text = el.innerText?.toLowerCase() || "";

    const hasConsentKeywords =
      /cookie|consent|privacy|tracking/.test(text);

    const hasActionButtons =
      el.querySelector("button") !== null;

    const isVisible =
      el.offsetHeight > 100 &&
      el.offsetWidth > 200;

    return hasConsentKeywords && hasActionButtons && isVisible;

  }) || null;
}


function extractActionButtons(banner) {

  if (!banner) return { acceptBtn: null, rejectBtn: null };

  const buttons = banner.querySelectorAll(
    "button, a, input[type='button'], input[type='submit']"
  );

  let acceptBtn = null;
  let rejectBtn = null;

  buttons.forEach(btn => {

    const text = (btn.innerText || btn.value || "").toLowerCase();

    if (!acceptBtn && /accept|agree|allow|continue/.test(text)) {
      acceptBtn = btn;
    }

    if (!rejectBtn && /reject|decline|deny|manage|settings|preferences/.test(text)) {
      rejectBtn = btn;
    }

  });

  return { acceptBtn, rejectBtn };
}


/* ===============================
   CORE ANALYSIS FUNCTION
================================= */

function runAnalysis() {

  console.log("Analyze triggered");

  const banner = extractConsentBanner();
  if (!banner) return;

  const { acceptBtn, rejectBtn } = extractActionButtons(banner);

  const visual = runVisualEngine(acceptBtn, rejectBtn);
  const semantic = runSemanticEngine(acceptBtn, rejectBtn);
  const effort = runEffortEngine(banner, acceptBtn, rejectBtn);
  const defaultBias = runDefaultEngine(banner);
  const pressure = runPressureEngine(banner);
  const confirmshaming = runConfirmshamingEngine(banner);
  const obstruction = runObstructionEngine(banner);

  const dpiResult = runDPIEngine({
    visual,
    semantic,
    effort,
    defaultBias,
    pressure,
    confirmshaming,
    obstruction
  });

  chrome.runtime.sendMessage({
    type: "UPDATE_DPI",
    url: location.hostname,
    result: dpiResult
  });

  console.log("Banner:", banner);
  console.log("Accept:", acceptBtn);
  console.log("Reject:", rejectBtn);
  console.log("DPI Result:", dpiResult);
}


/* ===============================
   IGNORE CHECK WRAPPER
================================= */

function analyzePage() {

  chrome.storage.local.get(["ignore_" + location.hostname], data => {

    if (data["ignore_" + location.hostname]) {
      console.log("Site ignored by user.");
      return;
    }

    runAnalysis();
  });
}


/* ===============================
   OBSERVER
================================= */

let timeout;

const observer = new MutationObserver(() => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    analyzePage();
  }, 800);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});


window.addEventListener("load", analyzePage);
