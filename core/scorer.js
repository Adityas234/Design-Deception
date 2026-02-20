export function calculateScore(findings) {
  let score = 100;

  findings.forEach(finding => {
    score -= finding.severity;
  });

  return score < 0 ? 0 : score;
}
