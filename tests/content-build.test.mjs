import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadNotebookContent, resolveContentRepoPath } from '../scripts/content/build-content.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixtureRepo = path.join(__dirname, 'fixtures', 'content-repo');

test('resolveContentRepoPath prefers explicit path and returns an absolute path', () => {
  const resolved = resolveContentRepoPath(fixtureRepo);
  assert.equal(resolved, fixtureRepo);
});

test('loadNotebookContent reads markdown files from the content repo structure', async () => {
  const notebook = await loadNotebookContent(fixtureRepo);

  assert.equal(notebook.notes.length, 1);
  assert.equal(notebook.notes[0].id, 'system-walkthroughs-debugging');
  assert.match(notebook.notes[0].content, /Moving Beyond Simple Line Logs/);

  assert.equal(notebook.projects.length, 1);
  assert.equal(notebook.projects[0].interactiveComponentId, 'sql');
  assert.match(notebook.projects[0].problem, /generated valid-looking query parameters/i);

  assert.equal(notebook.readingNotes.length, 1);
  assert.equal(notebook.readingNotes[0].author, 'Martin Kleppmann');
  assert.equal(notebook.readingNotes[0].actionableTakeaways.length, 2);
});
