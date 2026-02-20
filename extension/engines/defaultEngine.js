function runDefaultEngine(banner) {

  if (!banner) {
    return {
      active: false,
      score: 0,
      confidence: 0,
      evidence: {}
    };
  }

  const checkedInputs = banner.querySelectorAll(
    "input[type='checkbox']:checked"
  );

  let score = checkedInputs.length > 0 ? 0.9 : 0;

  return {
    active: score > 0.5,
    score,
    confidence: score,
    evidence: {
      checkedCount: checkedInputs.length
    }
  };
}
