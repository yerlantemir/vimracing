import glob from 'glob';
import fs from 'fs';

const MAX_SNIPPET_ROWS = 10;

// =======
main();
// =======

function main() {
  const fileBuffer = fs.readFileSync('./racesData/vimGolfSnippets.json');
  const vimGolfSnippets = JSON.parse(fileBuffer.toString());
  const snippetsDividedByLines = vimGolfSnippets.map(
    ({ start, target, source }) => {
      return {
        start: start.split('\n'),
        target: target.split('\n'),
        source
      };
    }
  );
  const filteredVilGolfSnippets =
    snippetsDividedByLines.filter(filterVilGolfSnippet);

  for (let lang of ['py', 'js']) {
    glob(`./racesData/${lang}/*.json`, (err, files) => {
      for (let file of files) {
        const snippetFileBuffer = fs.readFileSync(file);
        const fileSnippets = [
          ...JSON.parse(snippetFileBuffer.toString()),
          getRandomElement(filteredVilGolfSnippets),
          getRandomElement(filteredVilGolfSnippets)
        ];
        fs.writeFileSync(file, JSON.stringify(fileSnippets, null, 2));
      }
    });
  }
}

/*
    @snippet: {start: string[], target: string[]}
    @return: boolean
*/
function filterVilGolfSnippet(snippet) {
  const { start, target } = snippet;
  return (
    target.length <= MAX_SNIPPET_ROWS &&
    start.length <= MAX_SNIPPET_ROWS &&
    target.length > 0 &&
    start.length > 0
  );
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  const randomElement = array[randomIndex];
  return randomElement;
}
