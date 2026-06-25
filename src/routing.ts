export type AppRoute = 'home' | 'articles' | 'about';

const APP_ROUTE_PATHS: Record<AppRoute, string> = {
  home: '/',
  articles: '/articles',
  about: '/about',
};

const KNOWN_APP_PATHS = new Set(Object.values(APP_ROUTE_PATHS));

function normalizePath(path: string) {
  if (!path || path === '/') {
    return '/';
  }

  const withoutTrailingSlash = path.replace(/\/+$/, '');
  return withoutTrailingSlash.startsWith('/') ? withoutTrailingSlash : `/${withoutTrailingSlash}`;
}

function normalizeBasePath(basePath: string) {
  if (!basePath || basePath === '/') {
    return '/';
  }

  return `${normalizePath(basePath)}/`;
}

function appPathFromBrowserPath(pathname: string, basePath: string) {
  const normalizedPathname = normalizePath(pathname);
  const normalizedBasePath = normalizeBasePath(basePath);

  if (normalizedBasePath === '/') {
    return normalizedPathname;
  }

  if (
    normalizedPathname === normalizedBasePath.slice(0, -1) ||
    normalizedPathname.startsWith(normalizedBasePath)
  ) {
    const relativePath = normalizedPathname.slice(normalizedBasePath.length - 1);
    return normalizePath(relativePath);
  }

  return normalizedPathname;
}

export function routeForAppPath(appPath: string): AppRoute {
  const normalizedAppPath = normalizePath(appPath);

  if (normalizedAppPath === APP_ROUTE_PATHS.articles) {
    return 'articles';
  }

  if (normalizedAppPath === APP_ROUTE_PATHS.about) {
    return 'about';
  }

  return 'home';
}

export function routeForBrowserPath(pathname: string, basePath: string): AppRoute {
  return routeForAppPath(appPathFromBrowserPath(pathname, basePath));
}

export function browserPathForRoute(route: AppRoute, basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const appPath = APP_ROUTE_PATHS[route];

  if (normalizedBasePath === '/') {
    return appPath;
  }

  if (appPath === '/') {
    return normalizedBasePath;
  }

  return `${normalizedBasePath.slice(0, -1)}${appPath}`;
}

export function redirectAppPathFromSearch(search: string) {
  const params = new URLSearchParams(search);
  const redirectPath = params.get('redirect');

  if (!redirectPath) {
    return null;
  }

  const normalizedRedirectPath = normalizePath(redirectPath);
  return KNOWN_APP_PATHS.has(normalizedRedirectPath) ? normalizedRedirectPath : null;
}
