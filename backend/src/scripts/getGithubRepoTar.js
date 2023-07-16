import { Octokit } from 'octokit';
import fs from 'fs';
import tar from 'tar';
import glob from 'glob';

const GITHUB_TOKEN = 'TOKEN';
const REPO_OWNER = 'metarhia';
const REPO_NAME = 'impress';
const MAX_ERRORS_COUNT = 4;
const MIN_ERRORS_COUNT = 1;

// TODO: RENAME
// 5 - one line, 3 - two line, 2 - three line snippets
const LINES_SYMMETRY = [5, 3, 2];

const FILENAME = './bin/js.tar';
const TARGET_DIRECTORY = './bin/js_files'; // Target directory to save js files

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

const introduceSyntaxErrors = (code) => {
  const operations = ['add', 'delete', 'replace'];
  let newCode = code.split('');
  const numErrors =
    Math.floor(Math.random() * MAX_ERRORS_COUNT) + MIN_ERRORS_COUNT; // Random number of errors
  const possibleChars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_{}[]();,./*-+';

  for (let i = 0; i < numErrors; i++) {
    const operation = operations[Math.floor(Math.random() * operations.length)]; // Random operation
    const index = Math.floor(Math.random() * newCode.length); // Random index

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
  function processLines(lineCount, snippetCount) {
    for (let i = 0; i < snippetCount; i++) {
      let lines = [];
      for (let j = 0; j < lineCount; j++) {
        if (currentLineIndex + j >= fileLinesList.length) {
          return; // If out of bounds, return from the function, ending both loops
        }
        lines.push(fileLinesList[currentLineIndex + j]);
      }

      results[lineCount].push({
        target: lines.join('\n'),
        start: lines.map(introduceSyntaxErrors).join('\n')
      });

      currentLineIndex += lineCount;
    }
  }

  processLines(1, 5);
  processLines(2, 3);
  processLines(3, 2);

  return results;
};

(async function () {
  try {
    const { data } = await octokit.rest.repos.downloadTarballArchive({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: '' // leave blank for the latest commit of the main branch
    });

    fs.writeFileSync(FILENAME, Buffer.from(data));

    // Unzip the tar file
    await tar.x({ file: FILENAME, C: './' });

    // Find and copy all JS files to the target directory
    glob(`./${REPO_OWNER}*/**/*.js`, (err, files) => {
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
          .filter((a) => a !== '')
          .map((a) => a.trim());

        collectSnippetsFromFileLinesList(fileString, results);
      });

      fs.writeFile('results.json', JSON.stringify(results, null, 2), (err) => {
        if (err) throw err;
        console.log('Data written to file');
      });

      console.log('JS files are copied to ' + TARGET_DIRECTORY);
    });
  } catch (err) {
    console.log(err, 'ERROR');
  }
})();
