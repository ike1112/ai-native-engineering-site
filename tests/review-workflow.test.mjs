import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

import {
  getAverageScore,
  getBlockingIssues,
  getDimensionScore,
  getReviewArtifactPath,
  MIN_AVERAGE_SCORE,
  MIN_DIMENSION_SCORE,
  REQUIRED_REVIEW_FIELDS,
  REVIEW_DIMENSIONS,
} from '../scripts/review/review-config.mjs';

function buildReport(overrides = {}) {
  const scores = Object.fromEntries(
    REVIEW_DIMENSIONS.map((dimension) => [
      dimension,
      {
        score: 4,
        notes: `${dimension} looks strong.`,
      },
    ]),
  );

  return {
    draftPath: '/tmp/system-walkthrough.md',
    reviewedAt: '2026-06-24T00:00:00.000Z',
    verdict: 'publish',
    strongestElement: 'Specific engineering walkthrough.',
    weakestElement: 'A few examples could be tighter.',
    earnedSignals: ['Grounded implementation details'],
    genericSignals: [],
    revisionPriorities: ['Tighten the ending'],
    positioningAssessment: 'Aligned with the site positioning.',
    scores,
    ...overrides,
    scores: {
      ...scores,
      ...overrides.scores,
    },
  };
}

test('getReviewArtifactPath places the review artifact beside the draft with a review suffix', () => {
  const draftPath = path.join('content', 'essays', 'system-walkthrough.md');
  const artifactPath = getReviewArtifactPath(draftPath);

  assert.equal(
    artifactPath,
    path.join('content', 'essays', 'system-walkthrough.review.json'),
  );
});

test('getAverageScore returns the mean score across rubric dimensions', () => {
  const report = buildReport({
    scores: {
      clarity: { score: 5, notes: 'Very clear.' },
      specificity: { score: 4, notes: 'Solid.' },
      originality: { score: 4, notes: 'Solid.' },
      credibility: { score: 4, notes: 'Solid.' },
      readerValue: { score: 4, notes: 'Solid.' },
      engineeringJudgment: { score: 4, notes: 'Solid.' },
      structuralFlow: { score: 3, notes: 'Acceptable.' },
      voiceConsistency: { score: 4, notes: 'Solid.' },
      nonGenericness: { score: 4, notes: 'Solid.' },
      positioningFit: { score: 4, notes: 'Solid.' },
    },
  });

  assert.equal(getAverageScore(report), 4);
});

test('getDimensionScore reads the structured score object shape', () => {
  const report = buildReport();

  assert.equal(getDimensionScore(report, 'clarity'), 4);
});

test('getBlockingIssues blocks a draft when a critical dimension falls below threshold', () => {
  const report = buildReport({
    scores: {
      credibility: {
        score: MIN_DIMENSION_SCORE - 1,
        notes: 'Too thin.',
      },
    },
  });

  const issues = getBlockingIssues(report);

  assert.equal(issues.length, 1);
  assert.equal(issues[0].type, 'critical-dimension');
  assert.equal(issues[0].dimension, 'credibility');
  assert.equal(issues[0].threshold, MIN_DIMENSION_SCORE);
});

test('getBlockingIssues blocks a draft when the average score falls below threshold', () => {
  const report = buildReport({
    scores: {
      clarity: { score: 3, notes: 'Needs work.' },
      specificity: { score: 3, notes: 'Needs work.' },
      originality: { score: 3, notes: 'Needs work.' },
      credibility: { score: 3, notes: 'Needs work.' },
      readerValue: { score: 3, notes: 'Needs work.' },
      engineeringJudgment: { score: 3, notes: 'Needs work.' },
      structuralFlow: { score: 4, notes: 'Strong enough.' },
      voiceConsistency: { score: 4, notes: 'Strong enough.' },
      nonGenericness: { score: 4, notes: 'Strong enough.' },
      positioningFit: { score: 4, notes: 'Strong enough.' },
    },
  });

  const issues = getBlockingIssues(report);

  assert.equal(getAverageScore(report), 3.4);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].type, 'average-score');
  assert.equal(issues[0].threshold, MIN_AVERAGE_SCORE);
});

test('getBlockingIssues blocks a draft when a required rubric dimension score is missing', () => {
  const report = buildReport();
  delete report.scores.positioningFit;

  const issues = getBlockingIssues(report);

  assert.equal(issues.length, 1);
  assert.equal(issues[0].type, 'missing-dimension-score');
  assert.equal(issues[0].dimension, 'positioningFit');
});

test('getBlockingIssues blocks a draft when a required top-level review field is missing', () => {
  const report = buildReport();
  delete report.positioningAssessment;

  const issues = getBlockingIssues(report);

  assert.equal(REQUIRED_REVIEW_FIELDS.includes('positioningAssessment'), true);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].type, 'missing-review-field');
  assert.equal(issues[0].field, 'positioningAssessment');
});
