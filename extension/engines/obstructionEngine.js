function runObstructionEngine(banner) {

  if (!banner) {
    return {
      active: false,
      score: 0,
      confidence: 0,
      evidence: {}
    };
  }

  let obstructionScore = 0;

  // 1️⃣ Check if body scrolling is disabled
  const bodyStyle = window.getComputedStyle(document.body);
  const htmlStyle = window.getComputedStyle(document.documentElement);

  const scrollLocked =
    bodyStyle.overflow === "hidden" ||
    htmlStyle.overflow === "hidden";

  if (scrollLocked) obstructionScore += 0.4;

  // 2️⃣ Check if banner covers most of viewport
  const rect = banner.getBoundingClientRect();
  const viewportArea = window.innerWidth * window.innerHeight;
  const bannerArea = rect.width * rect.height;

  const coverageRatio = bannerArea / viewportArea;

  if (coverageRatio > 0.6) obstructionScore += 0.4;

  // 3️⃣ Check for fixed positioning
  const bannerStyle = window.getComputedStyle(banner);
  if (bannerStyle.position === "fixed") {
    obstructionScore += 0.2;
  }

  obstructionScore = Math.min(obstructionScore, 1);

  return {
    active: obstructionScore > 0.5,
    score: obstructionScore,
    confidence: obstructionScore,
    evidence: {
      scrollLocked,
      coverageRatio
    }
  };
}