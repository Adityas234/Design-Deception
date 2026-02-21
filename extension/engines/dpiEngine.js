function runDPIEngine(signals) {

  const weights = {
    visual: 0.30,
    semantic: 0.25,
    effort: 0.20,
    defaultBias: 0.15,
    pressure: 0.10,
    confirmshaming: 0.10,
    obstruction: 0.10
  };

  // Count strictly active signals
  const activeSignals = Object.values(signals).filter(signal =>
    signal && signal.active === true
  );

  console.log("Active Signals Count:", activeSignals.length);

  // False positive protection
  if (activeSignals.length < 2) {
    return {
      dpi: 0,
      risk: "Low",
      confidence: calculateConfidence(activeSignals.length, 0),
      summary: "No strong signs of interface manipulation detected.",
      issues: [],
      breakdown: signals
    };
  }

  /* ===============================
     PROPER WEIGHTED SCORING
  ================================ */

  let rawScore = 0;

  Object.keys(weights).forEach(key => {
    const signal = signals[key];
    if (signal && typeof signal.score === "number") {
      rawScore += signal.score * weights[key];
    }
  });

  console.log("Raw Score Before Normalization:", rawScore);

  // Normalize to 0–100
  const dpi = Math.round(Math.min(rawScore, 1) * 100);

  let risk = "Low";
  if (dpi >= 60) risk = "High";
  else if (dpi >= 30) risk = "Moderate";

  return {
    dpi,
    risk,
    confidence: calculateConfidence(activeSignals.length, dpi),
    summary: generateSummary(risk, signals),
    issues: generateIssues(signals),
    breakdown: signals
  };
}


/* ===============================
   CONFIDENCE CALCULATION
================================= */

function calculateConfidence(activeCount, dpi) {
  return Math.round(
    (activeCount / 5) * 50 +
    (dpi / 100) * 50
  );
}


/* ===============================
   SUMMARY
================================= */

function generateSummary(risk, signals) {

  if (risk === "Low")
    return "No strong signs of interface manipulation detected.";

  const active = Object.entries(signals)
    .filter(([_, value]) => value.active)
    .map(([key]) => key);

  if (risk === "Moderate") {
    return "This page nudges users through: " + active.join(", ") + ".";
  }

  return "This page strongly biases decisions using: " + active.join(", ") + ".";
}


/* ===============================
   ISSUE LIST
================================= */

function generateIssues(signals) {

  const issues = [];

  if (signals.visual?.active)
    issues.push("One option is visually emphasized.");

  if (signals.semantic?.active)
    issues.push("The alternative option requires extra navigation.");

  if (signals.effort?.active)
    issues.push("Rejecting requires more interaction steps.");

  if (signals.defaultBias?.active)
    issues.push("Consent options appear pre-enabled.");

  if (signals.pressure?.active)
    issues.push("Urgency or pressure language is used.");

  if (signals.confirmshaming?.active)
  issues.push("The rejection option uses guilt or shame-based wording.");

  if (signals.obstruction?.active)
  issues.push("The page blocks interaction until a choice is made.");

  return issues;
}