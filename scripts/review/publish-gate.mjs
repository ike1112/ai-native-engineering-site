import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  CRITICAL_DIMENSIONS,
  MIN_DIMENSION_SCORE,
  getAverageScore,
  getBlockingIssues,
  getReviewArtifactPath,
} from './review-config.mjs';

async function readJsonFile(filePath) {
  const source = await fs.readFile(filePath, 'utf8');
  return JSON.parse(source);
}

export async function evaluatePublishGate(inputPath) {
  if (!inputPath) {
    throw new Error('A Markdown draft path is required.');
  }

  const draftPath = path.resolve(inputPath);
  let draftStats;

  try {
    draftStats = await fs.stat(draftPath);
  } catch {
    return {
      ok: false,
      draftPath,
      artifactPath: getReviewArtifactPath(draftPath),
      reasons: [`Draft not found: ${draftPath}`],
    };
  }

  if (!draftStats.isFile()) {
    return {
      ok: false,
      draftPath,
      artifactPath: getReviewArtifactPath(draftPath),
      reasons: [`Draft path is not a file: ${draftPath}`],
    };
  }

  const artifactPath = getReviewArtifactPath(draftPath);
  let artifactStats;

  try {
    artifactStats = await fs.stat(artifactPath);
  } catch {
    return {
      ok: false,
      draftPath,
      artifactPath,
      reasons: [`Missing review artifact: ${artifactPath}`],
    };
  }

  if (!artifactStats.isFile()) {
    return {
      ok: false,
      draftPath,
      artifactPath,
      reasons: [`Review artifact path is not a file: ${artifactPath}`],
    };
  }

  let report;
  try {
    report = await readJsonFile(artifactPath);
  } catch (error) {
    return {
      ok: false,
      draftPath,
      artifactPath,
      reasons: [`Review artifact is not valid JSON: ${artifactPath}`, error.message],
    };
  }

  const issues = getBlockingIssues(report);
  const averageScore = getAverageScore(report);

  return {
    ok: issues.length === 0,
    draftPath,
    artifactPath,
    averageScore,
    issues,
    reasons: issues.map((issue) => issue.message),
  };
}

function formatResult(result) {
  if (result.ok) {
    return [
      'PASS: Draft cleared publish gate',
      `- Average score: ${result.averageScore.toFixed(2)}`,
      `- Critical dimensions: ${CRITICAL_DIMENSIONS.join(', ')} all at or above ${MIN_DIMENSION_SCORE}`,
    ].join('\n');
  }

  return [
    'FAIL: Draft blocked by publish gate',
    ...result.reasons.map((reason) => `- ${reason}`),
  ].join('\n');
}

async function main(argv = process.argv.slice(2)) {
  const [draftPath] = argv;

  try {
    const result = await evaluatePublishGate(draftPath);
    const output = formatResult(result);

    if (result.ok) {
      console.log(output);
      return;
    }

    console.error(output);
    process.exitCode = 1;
  } catch (error) {
    console.error(`FAIL: Draft blocked by publish gate\n- ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
