import { Octokit } from 'octokit';
import fs from 'fs';
import tar from 'tar';
import glob from 'glob';
import path, { dirname } from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

const GITHUB_TOKEN = args[0];
const REPO_LANG = args[1] || 'js';
const REPO_OWNER = args[2] || 'metarhia';
const REPO_NAME = args[3] || 'impress';
const BRANCH_NAME = args[4] || 'master';

const MAX_DOCUMENTS_COUNT = 50;
const MIN_SYMBOLS_COUNT = 20;
const MISTAKES_TO_SNIPPETS_COUNT_MAPPING = {
  1: 2,
  2: 2,
  3: 1
};

const FILENAME = path.join(__dirname, './bin/js.tar');

// ===================MAIN CALL===================
main();
// ===============================================

async function main() {
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  });
  if (!fs.existsSync(path.join(__dirname, './bin')))
    fs.mkdirSync(path.join(__dirname, './bin'));
  if (!fs.existsSync(`./racesData`)) fs.mkdirSync(`./racesData`);
  if (!fs.existsSync(`./racesData/${REPO_LANG}`))
    fs.mkdirSync(`./racesData/${REPO_LANG}`);

  try {
    const { data } = await octokit.rest.repos.downloadTarballArchive({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: BRANCH_NAME
    });

    fs.writeFileSync(FILENAME, Buffer.from(data));

    // Unzip the tar file
    await tar.x({ file: FILENAME, C: path.join(__dirname, './bin') });

    glob(
      path.join(__dirname, `./bin/${REPO_OWNER}*/**/*.${REPO_LANG}`),
      (err, files) => {
        if (err) {
          console.log(err, 'ERROR');
          return;
        }

        const results = Object.keys(MISTAKES_TO_SNIPPETS_COUNT_MAPPING).reduce(
          (acc, key) => {
            acc[key] = [];
            return acc;
          },
          {}
        );
        files.forEach((filePath) => {
          collectSnippetsFromFile(filePath, results);
        });

        let docIndex = 0;
        while (
          Object.keys(results).every(
            (key) =>
              results[key].length > MISTAKES_TO_SNIPPETS_COUNT_MAPPING[key]
          ) &&
          docIndex < MAX_DOCUMENTS_COUNT
        ) {
          let currentRaceDoc = [];

          Object.keys(MISTAKES_TO_SNIPPETS_COUNT_MAPPING).forEach(
            (mistakesCount) => {
              const snippetCount =
                MISTAKES_TO_SNIPPETS_COUNT_MAPPING[mistakesCount];
              for (let i = 0; i < snippetCount; i++) {
                const poppedItem = popRandomElement(results[mistakesCount]);
                if (!poppedItem) return;
                currentRaceDoc.push(poppedItem);
              }
            }
          );

          fs.writeFileSync(
            `./racesData/${REPO_LANG}/${docIndex}.json`,
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
}

function popRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  const randomElement = array[randomIndex];
  array.splice(randomIndex, 1);
  return randomElement;
}

function collectSnippetsFromFile(filePath, results) {
  const fileBuffer = fs.readFileSync(filePath);
  const fileLinesList = fileBuffer
    .toString()
    .split('\n')
    .map((a) => a.trim());

  let currentLineIndex = 0;
  const absoluteFilePath = getAbsoluteFilePath(filePath);

  const linesCount = Object.keys(MISTAKES_TO_SNIPPETS_COUNT_MAPPING);
  for (let i = 0; i < linesCount.length; i++) {
    const mistakesCount = linesCount[i];
    const snippetCount = MISTAKES_TO_SNIPPETS_COUNT_MAPPING[mistakesCount];

    const processedLines = processLines(
      fileLinesList,
      currentLineIndex,
      mistakesCount,
      snippetCount,
      absoluteFilePath
    );
    results[mistakesCount] = results[mistakesCount].concat(processedLines);
    currentLineIndex += snippetCount;
  }

  return results;
}

function processLines(
  fileLinesList,
  startingIndex,
  mistakesCount,
  snippetCount,
  absoluteFilePath
) {
  const result = [];

  for (let i = 0; i < snippetCount; i++) {
    const line = fileLinesList[startingIndex + i];
    if (!line || line.length < MIN_SYMBOLS_COUNT) {
      continue;
    }

    result.push({
      target: [line],
      start: [introduceSyntaxErrors(line, mistakesCount)],
      source: getSourceCodeLink(absoluteFilePath, startingIndex + i + 1)
    });
  }
  return result;
}

function getSourceCodeLink(filePath, lineNumber) {
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH_NAME}/${filePath}#L${lineNumber}`;
}

function getAbsoluteFilePath(relativePath) {
  const paths = relativePath.split('/');
  const rootDirPathIndex = paths.findIndex(
    (path) => path.includes(REPO_NAME) && path.includes(REPO_OWNER)
  );
  return paths.slice(rootDirPathIndex + 1).join('/');
}

function introduceSyntaxErrors(code, mistakesCount) {
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
}
