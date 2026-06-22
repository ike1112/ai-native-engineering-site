import fs from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {resolveContentRepoPath, writeGeneratedContent} from './scripts/content/build-content.mjs';

function notebookContentPlugin() {
  const contentRepoPath = resolveContentRepoPath();
  let regenerateTimer: NodeJS.Timeout | undefined;

  const regenerate = async () => {
    await writeGeneratedContent(contentRepoPath);
  };

  return {
    name: 'notebook-content-plugin',
    async buildStart() {
      await regenerate();
    },
    configureServer(server) {
      regenerate().catch((error) => {
        server.config.logger.error(`Content generation failed: ${String(error)}`);
      });

      const watcher = fs.watch(contentRepoPath, {recursive: true}, (_eventType, filename) => {
        if (!filename || !filename.endsWith('.md')) {
          return;
        }

        clearTimeout(regenerateTimer);
        regenerateTimer = setTimeout(() => {
          regenerate()
            .then(() => {
              server.ws.send({type: 'full-reload'});
            })
            .catch((error) => {
              server.config.logger.error(`Content regeneration failed: ${String(error)}`);
            });
        }, 100);
      });

      server.httpServer?.once('close', () => watcher.close());
    },
  };
}

export default defineConfig(() => {
  const siteBasePath =
    process.env.SITE_BASE_PATH ||
    (process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REPOSITORY
      ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
      : '/');

  return {
    base: siteBasePath,
    plugins: [notebookContentPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      fs: {
        allow: [
          path.resolve(__dirname),
          path.resolve(__dirname, '..', 'engineering-notebook-content'),
        ],
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
