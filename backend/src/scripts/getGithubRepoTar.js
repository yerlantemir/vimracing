import { Octokit } from 'octokit';
import fs from 'fs';
import tar from 'tar';
import glob from 'glob';

const GITHUB_TOKEN = 'TOKEN';
const REPO_OWNER = 'metarhia';
const REPO_NAME = 'impress';

const FILENAME = './bin/js.tar';
const TARGET_DIRECTORY = './bin/js_files'; // Target directory to save js files

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

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

      files.forEach((file) => {
        // GET CODE, SAVE BY JSON FILES
      });

      console.log('JS files are copied to ' + TARGET_DIRECTORY);
    });
  } catch (err) {
    console.log(err, 'ERROR');
  }
})();
