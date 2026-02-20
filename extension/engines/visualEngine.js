function runVisualEngine(acceptBtn, rejectBtn) {

  if (!acceptBtn || !rejectBtn) {
    return {
      active: false,
      score: 0,
      confidence: 0,
      evidence: {}
    };
  }

  const acceptRect = acceptBtn.getBoundingClientRect();
  const rejectRect = rejectBtn.getBoundingClientRect();

  const acceptArea = acceptRect.width * acceptRect.height;
  const rejectArea = rejectRect.width * rejectRect.height;

  const areaRatio = acceptArea / rejectArea;

  const acceptStyle = window.getComputedStyle(acceptBtn);
  const rejectStyle = window.getComputedStyle(rejectBtn);

  const acceptFontWeight = parseInt(acceptStyle.fontWeight) || 400;
  const rejectFontWeight = parseInt(rejectStyle.fontWeight) || 400;

  const fontDelta = acceptFontWeight - rejectFontWeight;

  const positionBias =
    acceptRect.top < rejectRect.top ? 1 : 0;

  let score = 0;

  if (areaRatio > 1.3) score += 0.4;
  if (fontDelta > 200) score += 0.3;
  if (positionBias) score += 0.3;

  score = Math.min(score, 1);

  return {
    active: score > 0.4,
    score,
    confidence: score,
    evidence: {
      areaRatio,
      fontDelta,
      positionBias
    }
  };
}
