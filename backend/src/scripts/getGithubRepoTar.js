import { Octokit } from 'octokit';
import fs from 'fs';
import tar from 'tar';
import glob from 'glob';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

const GITHUB_TOKEN = args[0];
const REPO_LANG = args[1] || 'js';
const REPO_OWNER = args[2] || 'metarhia';
const REPO_NAME = args[3] || 'impress';

const MIN_SYMBOLS_COUNT = 20;
// 5 - one line, 3 - two line, 2 - three line snippets
const ONE_LINER_COUNT = 5;
const TWO_LINER_COUNT = 3;
const THREE_LINER_COUNT = 3;

const FILENAME = path.join(__dirname, './bin/js.tar');

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

const popRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  const randomElement = array[randomIndex];
  array.splice(randomIndex, 1);
  return randomElement;
};

const introduceSyntaxErrors = (code, mistakesCount) => {
  const operations = ['add', 'delete', 'replace'];
  let newCode = code.split('');
  const numErrors = mistakesCount;
  const possibleChars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_{}[]();,./*-+';

  for (let i = 0; i < numErrors; i++) {
    const operation = operations[Math.floor(Math.random() * operations.length)]; // Random operation
    const index = Math.floor(Math.random() * newCode.length); // Random index

    if (newCode[index] === '\n') {
      continue; // Skip the operation if the character is '\n'
    }

    switch (operation) {
      case 'add':
        newCode.splice(
          index,
          0,
          possibleChars[Math.floor(Math.random() * possibleChars.length)]
        );
        break;
      case 'delete':
        if (index < newCode.length) {
          newCode.splice(index, 1);
        }
        break;
      case 'replace':
        newCode[index] =
          possibleChars[Math.floor(Math.random() * possibleChars.length)];
        break;
    }
  }

  return newCode.join('');
};

const collectSnippetsFromFileLinesList = (fileLinesList, results) => {
  let currentLineIndex = 0;
  // one liner
  function processLines(mistakesCount, snippetCount) {
    for (let i = 0; i < snippetCount; i++) {
      let lines = [];
      if (currentLineIndex >= fileLinesList.length) {
        return; // If out of bounds, return from the function, ending both loops
      }
      lines.push(fileLinesList[currentLineIndex]);

      results[mistakesCount].push({
        target: lines.map((a) => a),
        start: lines.map((a) => introduceSyntaxErrors(a, mistakesCount))
      });

      currentLineIndex++;
    }
  }

  processLines(1, ONE_LINER_COUNT);
  processLines(2, TWO_LINER_COUNT);
  processLines(3, THREE_LINER_COUNT);

  return results;
};

(async function () {
  if (!fs.existsSync(path.join(__dirname, './bin')))
    fs.mkdirSync(path.join(__dirname, './bin'));
  if (!fs.existsSync(`./src/racesData`)) fs.mkdirSync(`./src/racesData`);
  if (!fs.existsSync(`./src/racesData/${REPO_LANG}`))
    fs.mkdirSync(`./src/racesData/${REPO_LANG}`);

  try {
    const { data } = await octokit.rest.repos.downloadTarballArchive({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: '' // leave blank for the latest commit of the main branch
    });

    fs.writeFileSync(FILENAME, Buffer.from(data));

    // Unzip the tar file
    await tar.x({ file: FILENAME, C: path.join(__dirname, './bin') });

    // Find and copy all JS files to the target directory
    glob(
      path.join(__dirname, `./bin/${REPO_OWNER}*/**/*.${REPO_LANG}`),
      (err, files) => {
        if (err) {
          console.log(err, 'ERROR');
          return;
        }

        const results = { 1: [], 2: [], 3: [] };
        files.forEach((file) => {
          const fileBuffer = fs.readFileSync(file);
          const fileString = fileBuffer
            .toString()
            .split('\n')
            .filter((a) => a !== '' && a.length > MIN_SYMBOLS_COUNT)
            .map((a) => a.trim());

          collectSnippetsFromFileLinesList(fileString, results);
        });

        let docIndex = 0;
        while (
          results[1].length >= ONE_LINER_COUNT &&
          results[2].length >= TWO_LINER_COUNT &&
          results[3].length >= THREE_LINER_COUNT
        ) {
          let currentRaceDoc = [];
          for (let i = 0; i < ONE_LINER_COUNT; i++) {
            const poppedItem = popRandomElement(results[1]);
            if (!poppedItem) return;
            currentRaceDoc.push(poppedItem);
          }
          for (let i = 0; i < TWO_LINER_COUNT; i++) {
            const poppedItem = popRandomElement(results[2]);

            if (!poppedItem) return;
            currentRaceDoc.push(poppedItem);
          }
          for (let i = 0; i < THREE_LINER_COUNT; i++) {
            const poppedItem = popRandomElement(results[3]);
            if (!poppedItem) return;
            currentRaceDoc.push(poppedItem);
          }

          fs.writeFileSync(
            `./src/racesData/${REPO_LANG}/${docIndex}.json`,
            JSON.stringify(currentRaceDoc, null, 2)
          );

          docIndex++;
        }

        fs.rmdirSync(path.join(__dirname, 'bin'), { recursive: true });
      }
    );
  } catch (err) {
    fs.rmdirSync(path.join(__dirname, 'bin'), { recursive: true });
    console.log(err, 'ERROR');
  }
})();
