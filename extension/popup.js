chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

  const hostname = new URL(tabs[0].url).hostname;

  chrome.runtime.sendMessage(
    { type: "GET_DPI", url: hostname },
    (response) => {

      const result = response?.result;

      if (!result) {
        document.getElementById("summaryBox").innerText =
          "No analysis available for this page.";
        document.getElementById("scoreNumber").innerText = "0";
        return;
      }

      /* ===============================
         TRANSPARENCY SCORE
      ================================ */

      document.getElementById("scoreNumber").innerText = result.dpi;

      /* ===============================
         RISK BADGE
      ================================ */

      const badge = document.getElementById("riskBadge");
      badge.innerText = result.risk.toUpperCase();

      badge.classList.remove("low", "moderate", "high");

      if (result.risk === "Low") badge.classList.add("low");
      if (result.risk === "Moderate") badge.classList.add("moderate");
      if (result.risk === "High") badge.classList.add("high");

      /* ===============================
         SUMMARY
      ================================ */

      document.getElementById("summaryBox").innerText =
        result.summary;

      /* ===============================
         ISSUES
      ================================ */

      const issuesEl = document.getElementById("issues");
      issuesEl.innerHTML = "";

      if (!result.issues || result.issues.length === 0) {
        const div = document.createElement("div");
        div.className = "issue-item";
        div.innerText = "No manipulative patterns detected.";
        issuesEl.appendChild(div);
      } else {
        result.issues.forEach(issue => {
          const div = document.createElement("div");
          div.className = "issue-item";
          div.innerText = "⚠ " + issue;
          issuesEl.appendChild(div);
        });
      }

      /* ===============================
         PATTERN TYPE (Auto Derive)
      ================================ */

      const patternTypeEl = document.getElementById("patternType");
      patternTypeEl.innerHTML = "";

      const activePatterns = Object.entries(result.breakdown)
        .filter(([_, value]) => value.active)
        .map(([key]) => key);

      const createChip = (text) => {
        const chip = document.createElement("span");
        chip.className = "pattern-chip";
        chip.innerText = text;
        patternTypeEl.appendChild(chip);
      };

      if (activePatterns.includes("semantic") &&
          activePatterns.includes("effort")) {
        createChip("Forced Consent");
      }

      if (activePatterns.includes("visual")) {
        createChip("Visual Manipulation");
      }

      if (activePatterns.includes("defaultBias")) {
        createChip("Pre-Enabled Consent");
      }

      if (activePatterns.includes("pressure")) {
        createChip("Urgency Pressure");
      }

      if (patternTypeEl.innerHTML === "") {
        createChip("Interface Bias");
      }

      /* ===============================
         BREAKDOWN (Technical View)
      ================================ */

      const breakdownEl = document.getElementById("breakdown");
breakdownEl.innerHTML = "";

Object.entries(result.breakdown).forEach(([key, value]) => {

  const row = document.createElement("div");
  row.className = "signal-row";

  const labelMap = {
    visual: "Visual Imbalance",
    semantic: "Wording Asymmetry",
    effort: "Effort Imbalance",
    defaultBias: "Pre-Enabled Consent",
    pressure: "Urgency Pressure",
    confirmshaming: "Emotional Coercion",
    obstruction: "Interaction Blocking"
  };

  const title = document.createElement("div");
  title.className = "signal-title";
  title.innerText = labelMap[key] || key;

  const status = document.createElement("div");
  status.className = value.active ? "active" : "inactive";
  status.innerText = value.active ? "Detected" : "Not Detected";

  const description = document.createElement("div");
  description.className = "signal-description";

  if (value.active) {
    description.innerText =
      "Confidence: " + Math.round(value.confidence * 100) + "%";
  } else {
    description.innerText =
      "No significant evidence found.";
  }

  row.appendChild(title);
  row.appendChild(status);
  row.appendChild(description);

  breakdownEl.appendChild(row);
});

      /* ===============================
         CONFIDENCE
      ================================ */

      document.getElementById("confidence").innerText =
        "Confidence: " + result.confidence + "%";

      /* ===============================
         TOGGLE ADVANCED VIEW
      ================================ */

      document.getElementById("toggleAdvanced")
  .addEventListener("click", () => {

    const adv = document.getElementById("advanced");

    const isHidden = window.getComputedStyle(adv).display === "none";

    if (isHidden) {
      adv.style.display = "block";
    } else {
      adv.style.display = "none";
    }
});

      /* ===============================
         IGNORE SITE
      ================================ */

      document.getElementById("ignoreSite")
        .addEventListener("click", () => {

          chrome.storage.local.set({
            ["ignore_" + hostname]: true
          });

          window.close();
        });

      /* ===============================
         DISABLE DETECTION (Global)
      ================================ */

      document.getElementById("disableDetection")
        .addEventListener("click", () => {

          chrome.storage.local.set({
            detection_disabled: true
          });

          window.close();
        });

    }
  );
});