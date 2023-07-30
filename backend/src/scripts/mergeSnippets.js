import glob from 'glob';
import fs from 'fs';

const MAX_SNIPPET_ROWS = 10;

// =======
main();
// =======

async function main() {
  const vimGolfSnippets = getVimGolfSnippets();
  const aiPySnippets = getAiSnippets('py');
  const aiJsSnippets = getAiSnippets('js');
  const githubPySnippets = await getGithubSnippets('py');
  const githubJsSnippets = await getGithubSnippets('js');

  // py
  for (let i = 0; i < 50; i++) {
    const raceData = [
      getRandomElement(githubPySnippets),
      getRandomElement(aiPySnippets),
      getRandomElement(aiPySnippets),
      getRandomElement(aiPySnippets),
      getRandomElement(vimGolfSnippets)
    ];

    fs.writeFileSync(
      `./racesData/py/${i}.json`,
      JSON.stringify(raceData, null, 2)
    );
  }

  // js
  for (let i = 0; i < 50; i++) {
    const raceData = [
      getRandomElement(githubJsSnippets),
      getRandomElement(aiJsSnippets),
      getRandomElement(aiJsSnippets),
      getRandomElement(aiJsSnippets),
      getRandomElement(vimGolfSnippets)
    ];

    fs.writeFileSync(
      `./racesData/js/${i}.json`,
      JSON.stringify(raceData, null, 2)
    );
  }
}

function getVimGolfSnippets() {
  const fileBuffer = fs.readFileSync('./racesData/filteredGolfSnippets.json');
  const vimGolfSnippets = JSON.parse(fileBuffer.toString());
  return vimGolfSnippets;
}

function getAiSnippets(lang) {
  const aiSnippets = [];
  for (let i = 0; i < 10; i++) {
    const fileBuffer = fs.readFileSync(
      `./racesData/aisnippets/${lang}/${i}.json`
    );
    const snippets = JSON.parse(fileBuffer.toString());
    aiSnippets.push(...snippets);
  }
  return aiSnippets;
}

function getGithubSnippets(lang) {
  return new Promise((resolve, reject) => {
    const result = [];
    glob(`./racesData/githubSnippets/${lang}/*.json`, (err, files) => {
      for (let file of files) {
        const snippetFileBuffer = fs.readFileSync(file);
        const fileSnippets = [...JSON.parse(snippetFileBuffer.toString())];
        result.push(...fileSnippets);
      }
      resolve(result);
    });
  });
}

/*
    @snippet: {start: string[], target: string[]}
    @return: boolean
*/

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  const randomElement = array[randomIndex];
  return randomElement;
}
