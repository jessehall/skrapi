#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import pluralize from 'pluralize';
import slugify from 'slugify';
import utils from './utils.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const appRoot = utils.getAppRoot();
const clientDir = path.join(appRoot, 'client');
const apiDir = path.join(appRoot, 'api');

const pathToConfig = path.join(appRoot, 'client/skrapi.config.json');
if (!fs.existsSync(pathToConfig)) {
  utils.error('No skrapi.config.json found. Unable to proceed.');
  process.exit(0);
}

const config = require(pathToConfig);

run();

function run() {
  const apiHost = config.apiHost || 'http://localhost:3001';
  const apiRoot = config.apiRoot || '/api/v1';
  const apiUrlObj = new URL(apiRoot, apiHost);
  const apiUrl = apiUrlObj.href;

  // Prompt for Model name and route name.
  const crud = getCrudNames();
  if (!crud) return;

  // Add Model.
  const modelAdded = addModel(crud);
  if (!modelAdded) return;

  // Add Route.
  const routeAdded = addRoute(crud, apiRoot);
  if (!routeAdded) return;

  // Add Store.
  const storeAdded = addStore(crud);
  if (!storeAdded) return;

  // Add Test.
  const testAdded = addTest(crud, apiUrl);
  if (!testAdded) return;

  // Offer to continue adding crud.
  if (utils.confirm('Add another CRUD model?')) run();
}

function getCrudNames() {
  const collection = utils.prompt('Collection name? (ex: products): '); //  Malformed collection name passed?
  if (pluralize.isSingular(collection) || !/^[a-z]/.test(collection)) {
    utils.error('Error: Collection name must be plural and all lowercase.\n');
    return getCrudNames();
  }
  const route = slugify(collection, { lower: true }).replace(/-|\s/g, '');
  const singular = pluralize.singular(route);
  const modelSuggestion = singular.charAt(0).toUpperCase() + singular.slice(1);
  const model = utils.prompt('Model name for collection', modelSuggestion);
  const instance = modelSuggestion.toLowerCase();
  return { model, route, instance };
}

function addModel(crud) {
  return _writeFileFromTemplate({
    templatePath: path.join(clientDir, 'script/templates/model.js'),
    destinationPath: path.join(apiDir, `models/${crud.model}.js`),
    replacements: {
      MODEL: crud.model
    }
  });
}
function addRoute(crud) {
  return _writeFileFromTemplate({
    templatePath: path.join(clientDir, 'script/templates/route.js'),
    destinationPath: path.join(apiDir, `routes/${crud.route}.js`),
    replacements: {
      MODEL: crud.model,
      ROUTE: crud.route,
      INSTANCE: crud.instance
    }
  });
}

function addStore(crud) {
  return _writeFileFromTemplate({
    templatePath: path.join(clientDir, 'script/templates/store.js'),
    destinationPath: path.join(clientDir, `src/lib/stores/${crud.route}.js`),
    replacements: {
      ROUTE: crud.route,
      INSTANCE: crud.instance
    }
  });
}

function addTest(crud, apiUrl) {
  return _writeFileFromTemplate({
    templatePath: path.join(clientDir, 'script/templates/test.http'),
    destinationPath: path.join(apiDir, `tests/${crud.route}.http`),
    replacements: {
      API_URL: apiUrl,
      ROUTE: crud.route
    }
  });
}

function _writeFileFromTemplate({ templatePath, destinationPath, replacements }) {
  try {
    const templateCode = fs.readFileSync(templatePath, 'utf8');
    let newCode = templateCode;
    Object.keys(replacements).forEach(key => {
      const re = new RegExp(`\\\$${key}`, 'g');
      newCode = newCode.replace(re, replacements[key]);
    });
    const newFile = destinationPath;
    fse.outputFileSync(newFile, newCode);
    utils.success(`Added ${destinationPath}`);
  } catch (error) {
    console.log('error:', error);
    return false;
  }
  return true;
}
