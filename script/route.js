#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import slugify from 'slugify';
import utils from './utils.js';

const appRoot = utils.getAppRoot();

run();

function run() {
  // Prompt for page name and slug.
  const page = getPageNameAndSlug();
  if (!page) return;

  // Add <page>svelte route.
  const addedRoute = addRoute(appRoot, page);
  if (!addedRoute) return;

  // Append link to lib/data/nav.js
  const appendedNav = appendNav(appRoot, page);
  if (!appendedNav) return;

  // Offer to continue adding pages.
  if (utils.confirm('Add another page?')) run();
}

function getPageNameAndSlug() {
  const name = utils.prompt('Page name as it will appear in nav: ');
  const slugSuggestion = slugify(name, { lower: true });
  const slug = utils.prompt('Page slugified name for URL', slugSuggestion);
  return { name, slug };
}

function addRoute(appRoot, page) {
  try {
    const templateFile = path.join(appRoot, 'client/script/templates/page-stub.svelte');
    const templateCode = fs.readFileSync(templateFile, 'utf8');
    const newCode = templateCode.replace(/\$NAME/g, page.name);
    const newFile = path.join(appRoot, `client/src/routes/${page.slug}.svelte`);
    fse.outputFileSync(newFile, newCode);
    utils.success(`Added stub route at src/routes/${page.slug}.svelte`);
  } catch (error) {
    console.log('error:', error);
    return false;
  }
  return true;
}

function appendNav(appRoot, page) {
  try {
    const navFile = path.join(appRoot, 'client/src/lib/data/nav.json');
    const json = fs.readFileSync(navFile, 'utf8') || '[]';
    const data = JSON.parse(json);
    const newJson = JSON.stringify([...data, page], null, 2);
    fse.outputFileSync(navFile, newJson);
    utils.success('Appended link to src/lib/data/nav.json');
  } catch (error) {
    console.log('error:', error);
    return false;
  }
  return true;
}
