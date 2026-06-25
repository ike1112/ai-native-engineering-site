import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';

import { REVIEW_DIMENSIONS, getReviewArtifactPath } from './review-config.mjs';

function buildDimensionNotes(dimension, context) {
  const { hasFrontmatter, bodyLength } = context;

  if (!hasFrontmatter) {
    return 'Frontmatter is missing or empty; add concrete metadata before editorial scoring.';
  }

  if (bodyLength === 0) {
    return 'Draft body is empty; add substantive content before editorial scoring.';
  }

  return `Scaffolded ${dimension} review placeholder. Replace with a grounded editorial note.`;
}

export function createReviewArtifact({ draftPath, source, reviewedAt }) {
  const parsed = matter(source);
  const body = parsed.content.trim();
  const frontmatterKeys = Object.keys(parsed.data ?? {});
  const hasFrontmatter = frontmatterKeys.length > 0;

  const scores = Object.fromEntries(
    REVIEW_DIMENSIONS.map((dimension) => [
      dimension,
      {
        score: 0,
        notes: buildDimensionNotes(dimension, {
          hasFrontmatter,
          bodyLength: body.length,
        }),
      },
    ]),
  );

  return {
    draftPath,
    reviewedAt,
    verdict: 'revise',
    scores,
    strongestElement: hasFrontmatter
      ? `Metadata scaffold present (${frontmatterKeys.join(', ')}).`
      : 'No strong editorial signal detected yet.',
    weakestElement:
      body.length > 0
        ? 'Rubric scores are still placeholders and need a human review pass.'
        : 'Draft body is empty.',
    earnedSignals: hasFrontmatter ? [`Includes frontmatter keys: ${frontmatterKeys.join(', ')}`] : [],
    genericSignals: body.length === 0 ? ['No draft body content detected.'] : [],
    revisionPriorities: [
      'Replace placeholder rubric notes with evidence-backed editorial judgments.',
      'Set rubric scores for every review dimension before using this artifact for publishing decisions.',
      'Tighten positioning and specificity based on concrete build details from the draft.',
    ],
    positioningAssessment: hasFrontmatter
      ? 'Initial scaffold created. Confirm the draft reflects firsthand engineering work rather than generic AI commentary.'
      : 'Initial scaffold created, but positioning cannot be assessed until the draft includes content and metadata.',
  };
}

export async function reviewDraft(inputPath, { reviewedAt } = {}) {
  if (!inputPath) {
    throw new Error('A Markdown draft path is required.');
  }

  const draftPath = path.resolve(inputPath);
  let stats;

  try {
    stats = await fs.stat(draftPath);
  } catch {
    throw new Error(`Draft not found: ${draftPath}`);
  }

  if (!stats.isFile()) {
    throw new Error(`Draft path is not a file: ${draftPath}`);
  }

  const source = await fs.readFile(draftPath, 'utf8');
  const artifactPath = getReviewArtifactPath(draftPath);
  const artifact = createReviewArtifact({
    draftPath,
    source,
    reviewedAt: reviewedAt ?? stats.mtime.toISOString(),
  });

  await fs.mkdir(path.dirname(artifactPath), { recursive: true });
  await fs.writeFile(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');

  return { artifactPath, artifact };
}

async function main(argv = process.argv.slice(2)) {
  const [draftPath] = argv;

  try {
    const { artifactPath, artifact } = await reviewDraft(draftPath);
    const placeholderCount = Object.keys(artifact.scores).length;

    console.log(`Review scaffold written: ${artifactPath}`);
    console.log(`Verdict: ${artifact.verdict} | Dimensions scaffolded: ${placeholderCount}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
