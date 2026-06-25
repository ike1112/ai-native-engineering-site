import test from 'node:test';
import assert from 'node:assert/strict';

import {
  browserPathForRoute,
  redirectAppPathFromSearch,
  routeForAppPath,
  routeForBrowserPath,
} from '../src/routing.ts';

test('routeForBrowserPath resolves routes under the GitHub Pages base path', () => {
  assert.equal(routeForBrowserPath('/ai-native-engineering-site/', '/ai-native-engineering-site/'), 'home');
  assert.equal(routeForBrowserPath('/ai-native-engineering-site/articles', '/ai-native-engineering-site/'), 'articles');
  assert.equal(routeForBrowserPath('/ai-native-engineering-site/about/', '/ai-native-engineering-site/'), 'about');
});

test('browserPathForRoute builds GitHub Pages-aware hrefs', () => {
  assert.equal(browserPathForRoute('home', '/ai-native-engineering-site/'), '/ai-native-engineering-site/');
  assert.equal(browserPathForRoute('articles', '/ai-native-engineering-site/'), '/ai-native-engineering-site/articles');
  assert.equal(browserPathForRoute('about', '/ai-native-engineering-site/'), '/ai-native-engineering-site/about');
});

test('redirectAppPathFromSearch only accepts known app routes', () => {
  assert.equal(redirectAppPathFromSearch('?redirect=%2Farticles'), '/articles');
  assert.equal(redirectAppPathFromSearch('?redirect=%2Fabout%2F'), '/about');
  assert.equal(redirectAppPathFromSearch('?redirect=%2Fnope'), null);
});

test('routeForAppPath falls back to home for unknown app routes', () => {
  assert.equal(routeForAppPath('/'), 'home');
  assert.equal(routeForAppPath('/articles'), 'articles');
  assert.equal(routeForAppPath('/about'), 'about');
  assert.equal(routeForAppPath('/anything-else'), 'home');
});
