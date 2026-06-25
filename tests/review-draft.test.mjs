import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

import { REVIEW_DIMENSIONS, getReviewArtifactPath } from '../scripts/review/review-config.mjs';
import { createReviewArtifact, reviewDraft } from '../scripts/review/review-draft.mjs';

test('reviewDraft creates the expected artifact file beside the draft', async () => {
  const fixturePath = path.resolve('tests', 'fixtures', 'review', 'sample-draft.md');
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'review-draft-'));
  const draftPath = path.join(tempDir, 'sample-draft.md');
  const draftSource = await fs.readFile(fixturePath, 'utf8');

  await fs.writeFile(draftPath, draftSource, 'utf8');

  const { artifactPath } = await reviewDraft(draftPath, {
    reviewedAt: '2026-06-24T00:00:00.000Z',
  });

  assert.equal(artifactPath, getReviewArtifactPath(draftPath));

  const artifactSource = await fs.readFile(artifactPath, 'utf8');
  const artifact = JSON.parse(artifactSource);

  assert.equal(artifact.draftPath, draftPath);
  assert.equal(artifact.reviewedAt, '2026-06-24T00:00:00.000Z');
});

test('reviewDraft defaults reviewedAt to the draft mtime for deterministic output', async () => {
  const fixturePath = path.resolve('tests', 'fixtures', 'review', 'sample-draft.md');
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'review-draft-'));
  const draftPath = path.join(tempDir, 'sample-draft.md');
  const draftSource = await fs.readFile(fixturePath, 'utf8');
  const expectedReviewedAt = '2024-01-02T03:04:05.000Z';

  await fs.writeFile(draftPath, draftSource, 'utf8');
  await fs.utimes(draftPath, new Date(expectedReviewedAt), new Date(expectedReviewedAt));

  const { artifact } = await reviewDraft(draftPath);

  assert.equal(artifact.reviewedAt, expectedReviewedAt);
});

test('createReviewArtifact includes all required top-level keys', async () => {
  const fixturePath = path.resolve('tests', 'fixtures', 'review', 'sample-draft.md');
  const source = await fs.readFile(fixturePath, 'utf8');
  const artifact = createReviewArtifact({
    draftPath: '/tmp/sample-draft.md',
    source,
    reviewedAt: '2026-06-24T00:00:00.000Z',
  });

  assert.deepEqual(
    Object.keys(artifact),
    [
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
    ],
  );

  assert.deepEqual(Object.keys(artifact.scores), REVIEW_DIMENSIONS);
});

test('review-draft CLI exits with failure for an invalid draft path', async () => {
  const scriptPath = path.resolve('scripts', 'review', 'review-draft.mjs');
  const missingPath = path.resolve('tests', 'fixtures', 'review', 'missing-draft.md');

  const result = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, missingPath], {
      cwd: path.resolve('.'),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Draft not found:/);
  assert.equal(result.stdout, '');
});
