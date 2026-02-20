export function detectDarkPatterns() {
  const findings = [];

  const clickableElements = document.querySelectorAll(
    "button, a, [role='button'], input[type='button'], input[type='submit']"
  );

  let acceptBtn = null;
  let rejectBtn = null;

  clickableElements.forEach(el => {
    let text = "";

    if (el.innerText) {
      text = el.innerText.trim().toLowerCase();
    } else if (el.value) {
      text = el.value.trim().toLowerCase();
    }

    if (!text) return;

    if (!acceptBtn && (text.includes("accept") || text.includes("agree"))) {
      acceptBtn = el;
    }

    if (
      !rejectBtn &&
      (
        text.includes("reject") ||
        text.includes("decline") ||
        text.includes("manage") ||
        text.includes("settings")
      )
    ) {
      rejectBtn = el;
    }
  });

  // CASE 1: Accept exists but no Reject
  if (acceptBtn && !rejectBtn) {
    findings.push({
      type: "OBSTRUCTION",
      element: acceptBtn,
      severity: 25,
      message: "No visible reject option found."
    });
  }

  // CASE 2: Both exist
  if (acceptBtn && rejectBtn) {
    const acceptStyle = window.getComputedStyle(acceptBtn);
    const rejectStyle = window.getComputedStyle(rejectBtn);

    const acceptWeight =
      acceptStyle.fontWeight === "bold"
        ? 700
        : parseInt(acceptStyle.fontWeight) || 400;

    const rejectWeight =
      rejectStyle.fontWeight === "bold"
        ? 700
        : parseInt(rejectStyle.fontWeight) || 400;

    if (
      acceptStyle.backgroundColor !== rejectStyle.backgroundColor ||
      acceptWeight > rejectWeight
    ) {
      findings.push({
        type: "MISDIRECTION",
        element: acceptBtn,
        severity: 20,
        message: "Accept option visually emphasized over reject."
      });
    }

    if (
      rejectStyle.display === "none" ||
      rejectStyle.visibility === "hidden" ||
      parseFloat(rejectStyle.opacity) < 0.5 ||
      rejectBtn.disabled
    ) {
      findings.push({
        type: "OBSTRUCTION",
        element: rejectBtn,
        severity: 25,
        message: "Reject option hidden or visually suppressed."
      });
    }
  }

  return findings;
}
