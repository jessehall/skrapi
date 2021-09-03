#!/usr/bin/env node

import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import promptSync from 'prompt-sync';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const prompt = promptSync({ sigint: true });

const utils = {
  error(message) {
    console.log(chalk.bold.red(`\n✕ ${message}\n`));
  },

  success(message) {
    console.log(chalk.cyan(`\n✔ ${message}`));
  },

  confirm(message) {
    console.log(''); // New line
    const confirmed = prompt(`${message} [Y/n]: `) || 'Y';
    return Boolean(['Y', 'y', 'Yes', 'yes'].includes(confirmed));
  },

  prompt(message, value = '') {
    console.log(''); // New line
    if (value) message += ` [${value}]: `;
    return prompt(message) || value;
  },

  getAppRoot() {
    const thisDir = dirname(fileURLToPath(import.meta.url));
    return path.join(thisDir, '../..');
  },

  stripOuterQuotes(str) {
    return str.replace(/^['"](.*)['"]$/, '$1');
  }
};

export default utils;
