import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

import { REVIEW_DIMENSIONS, getReviewArtifactPath } from '../scripts/review/review-config.mjs';

const scriptPath = path.resolve('scripts', 'review', 'publish-gate.mjs');
const draftFixturePath = path.resolve('tests', 'fixtures', 'review', 'sample-draft.md');

async function createTempDraft() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'publish-gate-'));
  const draftPath = path.join(tempDir, 'sample-draft.md');
  const draftSource = await fs.readFile(draftFixturePath, 'utf8');

  await fs.writeFile(draftPath, draftSource, 'utf8');

  return { tempDir, draftPath };
}

function buildArtifact(draftPath, scoreFactory) {
  const scores = Object.fromEntries(
    REVIEW_DIMENSIONS.map((dimension) => [
      dimension,
      scoreFactory(dimension),
    ]),
  );

  return {
    draftPath,
    reviewedAt: '2026-06-24T00:00:00.000Z',
    verdict: 'publish',
    scores,
    strongestElement: 'Strong technical detail.',
    weakestElement: 'A few examples can still improve.',
    earnedSignals: ['Shows firsthand implementation details'],
    genericSignals: [],
    revisionPriorities: ['Tighten one example'],
    positioningAssessment: 'Consistent with the intended positioning.',
  };
}

async function writeArtifact(draftPath, artifact) {
  const artifactPath = getReviewArtifactPath(draftPath);
  await fs.writeFile(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  return artifactPath;
}

async function runPublishGate(draftPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, draftPath], {
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
}

test('missing review artifact blocks publish', async () => {
  const { draftPath } = await createTempDraft();

  const result = await runPublishGate(draftPath);

  assert.equal(result.code, 1);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /FAIL: Draft blocked by publish gate/);
  assert.match(result.stderr, /Missing review artifact:/);
});

test('critical dimension below threshold blocks publish', async () => {
  const { draftPath } = await createTempDraft();
  await writeArtifact(
    draftPath,
    buildArtifact(draftPath, (dimension) => ({
      score: dimension === 'credibility' ? 2 : 4,
      notes: `${dimension} assessment.`,
    })),
  );

  const result = await runPublishGate(draftPath);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /credibility scored 2, below the minimum 3\./);
});

test('average score below threshold blocks publish', async () => {
  const { draftPath } = await createTempDraft();
  await writeArtifact(
    draftPath,
    buildArtifact(draftPath, (dimension) => ({
      score: ['clarity', 'specificity', 'originality', 'credibility', 'readerValue', 'engineeringJudgment'].includes(
        dimension,
      )
        ? 3
        : 4,
      notes: `${dimension} assessment.`,
    })),
  );

  const result = await runPublishGate(draftPath);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Average score is 3\.40, below the minimum 3\.5\./);
});

test('valid review report passes', async () => {
  const { draftPath } = await createTempDraft();
  await writeArtifact(
    draftPath,
    buildArtifact(draftPath, () => ({
      score: 4,
      notes: 'Strong enough to publish.',
    })),
  );

  const result = await runPublishGate(draftPath);

  assert.equal(result.code, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /PASS: Draft cleared publish gate/);
  assert.match(result.stdout, /Average score: 4\.00/);
});

test('non-publish verdict blocks publish even when scores are high', async () => {
  const { draftPath } = await createTempDraft();
  await writeArtifact(draftPath, {
    ...buildArtifact(draftPath, () => ({
      score: 5,
      notes: 'Strong enough to publish.',
    })),
    verdict: 'revise',
  });

  const result = await runPublishGate(draftPath);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /FAIL: Draft blocked by publish gate/);
  assert.match(
    result.stderr,
    /Review verdict is "revise", but publish is required to clear the gate\./,
  );
});
