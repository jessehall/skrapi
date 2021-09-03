// #!/usr/bin/env node

// /*
// On each Rollup reload, automatically check for new <Snip> elements in any file in the components and
// pages directories.

// ## Page Snips

// If any of our routes files contain a snip that looks like this:
// ```
// <Snip>Lorem ipsum dolor</Snip>
// ```

// This script will do two things for EACH page where populated scripts are found:

// 1. Those page components will be rewritten to contain `<Snip id="123"/>` as a self-closing tag with
//    the content removed.

// 2. A JSON file will be updated (or created) corresponding to this page. If the page is
//    `src/routes/about-us/history.svelte`, the JSON file will be at
//    `static/snips/about-us/history.json`.
// ```

// ## Global Snips

// Some snips are not associated with any single page. For example, there may be editable content in
// the Footer component. When parse-snips finds snips with the `global` attribute, it will save them to
// _global.json and these will be available to Snip components site-wide referenced by the name value
// (which must be globally unique).

// ## Title Snips

// A snip with the `title` attribute will be used to populate a title tag for the page.
// example: <Snip title>Our company history</Snip>

// ## Description Snips

// A snip with the `description` attribute will be used to populate a meta description tag for the page.
// example: <Snip description>Learn all about our company history!</Snip>

// // Dev Note: This feels a bit convoluted with loops within loops. Ideally, we'd make an array of
// // all svelte files, then go through each one to parse the snips. The problem with this idea is
// // that we'd need to double or triple our disk reads which could have hefty performance impact. So
// // we just do it all in one big nested loop for each page instead.

// */

// import path from 'path';
// import fs from 'fs';
// import fse from 'fs-extra';
// import prompt from 'syncprompt';
// import slugify from 'slugify';
// import shortid from 'shortid';
// import utils from './utils.js';

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const appRoot = utils.getAppRoot();
// const svelteDirs = ['routes'];

// run();

// function run() {
//   // Loop through files and find instances of populated Snip tags
//   svelteDirs.map(dir => {
//     let dirPath = path.resolve(path.join(__dirname, '../src/', dir));
//     parseInDir(dirPath);
//   });
// }

// /* -------------------------------------------------- */

// function parseInDir(dirPath) {
//   fs.readdirSync(dirPath).forEach(file => {
//     if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
//       // This is a directory, call parseInDir() to recurse into it
//       parseInDir(path.join(dirPath, file));
//     } else if (path.extname(file) == '.svelte') {
//       // This is a svelte file, parse it
//       parseSvelteFile(path.join(dirPath, file));
//     }
//   });
// }

// function parseSvelteFile(svelteFile) {
//   console.log('svelteFile:', svelteFile);
//   let pageSnipsMeta = [];
//   let pageSnipsData = [];
//   let globalSnipsData = [];
//   fs.readFile(svelteFile, 'utf8', function (err, svelteCode) {
//     if (err) {
//       return console.log(err);
//     }
//     // File loaded. Any populated Snips in this code that we should parse?
//     let foundSnips = [];
//     let lastUsedId;
//     let snipRegex =
//       /<Snip(\s*(global)|\s*(title)|\s*(description)|\s*(name\s*=\s*["'](.*)["']))*>(.*)<\/Snip>/g;
//     while ((foundSnips = snipRegex.exec(svelteCode)) !== null) {
//       let [element, attrs, global, title, description, nameAttr, name, content] = foundSnips;
//       let snipObject = {};
//       let selfClosingTag = '<Snip';
//       // Make an id in case we need it below
//       let id = shortid.generate();
//       id = id === lastUsedId ? id + 1 : id; // Avoid duplicate ids
//       lastUsedId = id;
//       // Make global snip?
//       if (global) {
//         snipObject[id] = { id: id, name: name, content: content };
//         globalSnipsData.push(snipObject);
//         selfClosingTag += ' global';
//         selfClosingTag += nameAttr ? ` ${nameAttr}` : '';
//         selfClosingTag += ` id="${id}"`;
//       }
//       // Make regular page snip?
//       else if (!global && !title && !description) {
//         snipObject[id] = { id: id, name: name, content: content };
//         pageSnipsData.push(snipObject);
//         selfClosingTag += nameAttr ? ` ${nameAttr}` : '';
//         selfClosingTag += ` id="${id}"`;
//       }
//       // Make title snip?
//       else if (title) {
//         snipObject['title'] = content;
//         pageSnipsMeta = [...pageSnipsMeta, snipObject];
//         selfClosingTag += ' title';
//       }
//       // Make description snip
//       else if (description) {
//         snipObject['description'] = content;
//         pageSnipsMeta = [...pageSnipsMeta, snipObject];
//         selfClosingTag += ' description';
//       }
//       selfClosingTag += '/>';
//       svelteCode = svelteCode.replace(element, selfClosingTag);
//     }
//     if (pageSnipsMeta.length > 0 || pageSnipsData.length > 0) {
//       // Write the JSON file with new data appended
//       writePageJson(svelteFile, pageSnipsMeta, pageSnipsData);
//       // Write the svelte file with self-closing Snip tags
//       writeSvelteFile(svelteFile, svelteCode);
//     }
//     if (globalSnipsData.length > 0) {
//       // Write the JSON file with new data appended
//       writeGlobalJson(globalSnipsData);
//       // Write the svelte file with self-closing Snip tags
//       writeSvelteFile(svelteFile, svelteCode);
//     }
//   });
// }

// function writePageJson(svelteFile, snipsMeta, snipsData) {
//   // Derive path and jsonFile from svelteFile
//   const res = svelteFile.match(/(.*)\/src\/routes\/(([\w\d_\-\/]+\/)?[\w\d_\-\/]+).svelte/);
//   if (!res) return console.log('parse-snips: Unable to find the path in', svelteFile);
//   const appRoot = res[1]; // ex: "/Users/sean/Projects/my-badass-project"
//   const slug = res[2]; // ex: "index" or "about-us/history"
//   const parentDirs = res[3] || ''; // ex: "team/" or "products/outdoor/gardening/"
//   const parentRoot = `${appRoot}/static/snips/${parentDirs}`;
//   const jsonFile = `${appRoot}/static/snips/${slug}.json`;

//   // Load current JSON file (if there is one)
//   fs.readFile(jsonFile, 'utf8', (err, jsonCode) => {
//     if (jsonCode) {
//       try {
//         jsonCode = JSON.parse(jsonCode);
//       } catch (err) {
//         console.log('parse-snips: Unable to parse', jsonFile);
//       }
//     } else {
//       // Make a page name from slug name
//       const name = getName(slug);
//       jsonCode = {
//         title: name,
//         description: '',
//         name: name,
//         position: '',
//         data: {}
//       };
//     }
//     writeJson(jsonCode, snipsMeta, snipsData, jsonFile);
//   });
// }

// function writeGlobalJson(snipsData) {
//   const jsonFile = path.resolve(path.join(__dirname, '/../static/snips/_global.json'));
//   // Load current JSON file (if there is one)
//   fs.readFile(jsonFile, 'utf8', (err, jsonCode) => {
//     if (jsonCode) {
//       try {
//         jsonCode = JSON.parse(jsonCode);
//       } catch (err) {
//         console.log('parse-snips: Unable to parse', jsonFile);
//       }
//     } else {
//       jsonCode = { data: {} };
//     }
//     writeJson(jsonCode, snipsData, jsonFile);
//   });
// }

// function writeJson(jsonCode, snipsMeta, snipsData, jsonFile) {
//   const snipOrSnips = snipsData.length === 1 ? 'snip' : 'snips';
//   const res = jsonFile.match(/(.*)\/static\/snips\/(([\w\d_\-\/]+\/)?[\w\d_\-\/]+).json/);
//   console.log(`Writing ${snipsData.length} ${snipOrSnips} to ${res[2]}.json.`);
//   // Add new snip meta objects
//   snipsMeta.map(snipMeta => {
//     jsonCode = { ...jsonCode, ...snipMeta };
//   });
//   // Add new snip page objects to data array
//   snipsData.map(snipData => {
//     jsonCode.data = { ...jsonCode.data, ...snipData };
//   });
//   // Save globalSnipsData to _global.json file
//   const jsonCodeString = JSON.stringify(jsonCode, null, 2); // formatted json with indent: 2
//   fs.writeFile(jsonFile, jsonCodeString, 'utf8', function (err) {
//     if (err) return console.log(err);
//   });
// }

// function writeSvelteFile(svelteFile, svelteCode) {
//   fs.writeFile(svelteFile, svelteCode, 'utf8', function (err) {
//     if (err) return console.log(err);
//   });
// }

// function getName(slug) {
//   const slugParts = slug.split('/');
//   let name = slugParts.slice(-1)[0]; // last element
//   name = name.replace('-', ' ').replace('_', ' ');
//   if (name === 'index') name = 'Home';
//   return titleCase(name);
// }
