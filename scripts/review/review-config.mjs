import path from 'node:path';

export const REVIEW_DIMENSIONS = [
  'clarity',
  'specificity',
  'originality',
  'credibility',
  'readerValue',
  'engineeringJudgment',
  'structuralFlow',
  'voiceConsistency',
  'nonGenericness',
  'positioningFit',
];

export const CRITICAL_DIMENSIONS = [
  'clarity',
  'credibility',
  'nonGenericness',
  'positioningFit',
];

export const MIN_DIMENSION_SCORE = 3;
export const MIN_AVERAGE_SCORE = 3.5;
export const REQUIRED_REVIEW_FIELDS = [
  'draftPath',
  'reviewedAt',
  'verdict',
  'scores',
  'strongestElement',
  'weakestElement',
  'earnedSignals',
  'genericSignals',
  'revisionPriorities',
  'positioningAssessment',
];

function hasOwn(object, key) {
  return Boolean(object) && Object.prototype.hasOwnProperty.call(object, key);
}

export function getDimensionScoreEntry(report, dimension) {
  return report?.scores?.[dimension] ?? null;
}

export function getDimensionScore(report, dimension) {
  const scoreEntry = getDimensionScoreEntry(report, dimension);

  if (typeof scoreEntry === 'number') {
    return scoreEntry;
  }

  if (
    scoreEntry &&
    typeof scoreEntry === 'object' &&
    typeof scoreEntry.score === 'number'
  ) {
    return scoreEntry.score;
  }

  return null;
}

export function getReviewArtifactPath(draftPath) {
  const parsedPath = path.parse(draftPath);
  return path.join(parsedPath.dir, `${parsedPath.name}.review.json`);
}

export function getMissingRequiredReviewFields(report) {
  return REQUIRED_REVIEW_FIELDS.filter((field) => !hasOwn(report, field));
}

export function getAverageScore(report) {
  const scores = REVIEW_DIMENSIONS
    .map((dimension) => getDimensionScore(report, dimension))
    .filter((score) => typeof score === 'number');

  if (scores.length === 0) {
    return 0;
  }

  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
}

export function getBlockingIssues(report) {
  const issues = [];

  for (const field of getMissingRequiredReviewFields(report)) {
    issues.push({
      type: 'missing-review-field',
      field,
      message: `${field} is missing from the review artifact.`,
    });
  }

  if (hasOwn(report, 'verdict') && report.verdict !== 'publish') {
    issues.push({
      type: 'verdict',
      verdict: report.verdict,
      message: `Review verdict is ${JSON.stringify(report.verdict)}, but publish is required to clear the gate.`,
    });
  }

  for (const dimension of REVIEW_DIMENSIONS) {
    const score = getDimensionScore(report, dimension);

    if (score === null) {
      issues.push({
        type: 'missing-dimension-score',
        dimension,
        message: `${dimension} is missing a required numeric score.`,
      });
    }
  }

  for (const dimension of CRITICAL_DIMENSIONS) {
    const score = getDimensionScore(report, dimension);

    if (score !== null && score < MIN_DIMENSION_SCORE) {
      issues.push({
        type: 'critical-dimension',
        dimension,
        score,
        threshold: MIN_DIMENSION_SCORE,
        message: `${dimension} scored ${score}, below the minimum ${MIN_DIMENSION_SCORE}.`,
      });
    }
  }

  const averageScore = getAverageScore(report);
  if (averageScore < MIN_AVERAGE_SCORE) {
    issues.push({
      type: 'average-score',
      score: averageScore,
      threshold: MIN_AVERAGE_SCORE,
      message: `Average score is ${averageScore.toFixed(2)}, below the minimum ${MIN_AVERAGE_SCORE}.`,
    });
  }

  return issues;
}

export function summarizeBlockingIssues(report) {
  const issues = getBlockingIssues(report);

  if (issues.length === 0) {
    return 'No blocking issues.';
  }

  return issues.map((issue) => issue.message).join(' ');
}
