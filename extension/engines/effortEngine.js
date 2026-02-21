function runEffortEngine(banner, acceptBtn, rejectBtn) {

  if (!banner || !acceptBtn || !rejectBtn) {
    return {
      active: false,
      score: 0,
      confidence: 0,
      evidence: {}
    };
  }

  let extraLayers = 0;

  // Check if reject button opens another dialog
  const rejectTarget =
    rejectBtn.getAttribute("data-target") ||
    rejectBtn.getAttribute("aria-controls");

  if (rejectTarget) {
    const linkedElement = document.getElementById(rejectTarget);
    if (linkedElement) extraLayers++;
  }

  // Check if reject button has modal-related attributes
  const rejectTriggersModal =
    rejectBtn.closest("[role='dialog']") !== banner ||
    rejectBtn.hasAttribute("data-modal") ||
    rejectBtn.className.toLowerCase().includes("settings");

  if (rejectTriggersModal) extraLayers++;

  // Check nested modals inside banner
  const nestedDialogs = banner.querySelectorAll("[role='dialog']");
  if (nestedDialogs.length > 1) extraLayers++;

  // Compare with accept behavior
  const acceptTriggersModal =
    acceptBtn.getAttribute("data-target") ||
    acceptBtn.getAttribute("aria-controls");

  if (!acceptTriggersModal && extraLayers > 0) {
    // Clear asymmetry
    extraLayers += 1;
  }

  let score = 0;

  if (extraLayers >= 2) score = 0.8;
  else if (extraLayers === 1) score = 0.6;

  return {
    active: score > 0.5,
    score,
    confidence: score,
    evidence: {
      extraLayersDetected: extraLayers
    }
  };
}