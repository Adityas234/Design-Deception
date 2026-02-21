function runConfirmshamingEngine(banner) {

  if (!banner) {
    return {
      active: false,
      score: 0,
      confidence: 0,
      evidence: {}
    };
  }

  const shamePatterns = [
    /i don.?t care/i,
    /no thanks/i,
    /i prefer/i,
    /not interested/i,
    /i don.?t want/i,
    /i like worse/i,
    /i refuse/i
  ];

  const buttons = banner.querySelectorAll("button, a");

  let matches = [];

  buttons.forEach(btn => {
    const text = (btn.innerText || "").toLowerCase();

    shamePatterns.forEach(pattern => {
      if (pattern.test(text)) {
        matches.push(text);
      }
    });
  });

  const score = matches.length > 0 ? 0.8 : 0;

  return {
    active: score > 0.5,
    score,
    confidence: score,
    evidence: {
      matchedTexts: matches
    }
  };
}