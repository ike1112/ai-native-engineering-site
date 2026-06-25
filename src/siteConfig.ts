export const SITE_CONFIG = {
  siteName: 'Isabel Ke',
  siteTitle: 'Isabel Ke | Public Engineering Notebook',
  shortLabel: 'Public Engineering Notebook',
  packageName: 'engineering-notebook-site',
  description:
    'A public engineering notebook about building with AI in practice, drawn from real projects, verification work, reliability lessons, and system understanding.',
  githubRepoUrl: 'https://github.com/ike1112/ai-native-engineering-site',
  githubDiscussionsUrl:
    'https://github.com/ike1112/ai-native-engineering-site/discussions',
};

export const COMMUNITY_CONFIG = {
  giscusRepo: import.meta.env.VITE_GISCUS_REPO,
  giscusRepoId: import.meta.env.VITE_GISCUS_REPO_ID,
  giscusCategory: import.meta.env.VITE_GISCUS_CATEGORY,
  giscusCategoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID,
  giscusMapping: import.meta.env.VITE_GISCUS_MAPPING ?? 'specific',
  giscusStrict: import.meta.env.VITE_GISCUS_STRICT ?? '0',
  giscusReactionsEnabled: import.meta.env.VITE_GISCUS_REACTIONS_ENABLED ?? '1',
  giscusEmitMetadata: import.meta.env.VITE_GISCUS_EMIT_METADATA ?? '0',
  giscusInputPosition: import.meta.env.VITE_GISCUS_INPUT_POSITION ?? 'top',
  giscusTheme: import.meta.env.VITE_GISCUS_THEME ?? 'light',
  giscusLang: import.meta.env.VITE_GISCUS_LANG ?? 'en',
};

export function hasGiscusConfig() {
  return Boolean(
    COMMUNITY_CONFIG.giscusRepo &&
      COMMUNITY_CONFIG.giscusRepoId &&
      COMMUNITY_CONFIG.giscusCategory &&
      COMMUNITY_CONFIG.giscusCategoryId,
  );
}
