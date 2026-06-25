# Review Workflow

This workflow gives every draft the same editorial check before it is published. The goal is not hype-policing for its own sake. It is to reward firsthand engineering judgment, concrete evidence, and clear reader value while catching generic AI commentary before it lands on the site.

## What the review checks

Each draft is scored from 1 to 5 on these dimensions:

- clarity
- specificity
- originality
- credibility
- reader value
- engineering judgment
- structural flow
- voice consistency
- non-genericness
- positioning fit

The review should reward drafts that show what was built, what broke, what changed Isabel's mind, where AI helped, and where it created new responsibility. It should penalize vague abstractions, trend-summary writing, inflated positioning, and commentary that could have been written without firsthand experience.

## What scores mean

- `5`: unusually strong, specific, and clearly earned
- `4`: solid and publishable with minor improvements
- `3`: acceptable, but needs sharper execution
- `2`: weak or too generic
- `1`: missing, misleading, or actively harmful to the piece

## When a draft is blocked

A draft is blocked when either of these is true:

- any required rubric score is missing or malformed
- the review verdict is anything other than `publish`
- any critical dimension is below `3`: `clarity`, `credibility`, `nonGenericness`, or `positioningFit`
- the overall average score is below `3.5`

When blocked, the review output should name the weakest areas plainly and give revision priorities without slipping into hype, vague praise, or generic AI language.

## How the workflow is used

The shared rubric in `scripts/review/review-config.mjs` is the foundation for two later steps:

1. a draft review command that reads a Markdown draft and writes a structured review artifact
2. a publish gate that checks the review artifact before content goes live

The review artifact path is deterministic: for a draft like `content/my-post.md`, the review lives beside it as `content/my-post.review.json`.

Run the scaffold step with:

`npm run review:draft -- content/my-post.md`

Today this command creates a structured placeholder artifact with:

- `verdict: "revise"`
- one score entry per rubric dimension, each starting at `0`
- placeholder notes that must be replaced by a real human review

Run the gate with:

`npm run publish:gate -- content/my-post.md`

The gate only passes when the review artifact exists, is valid JSON, includes all required top-level fields, has numeric scores for every dimension, meets the critical-dimension and average-score thresholds, and sets `verdict` to `publish`.
