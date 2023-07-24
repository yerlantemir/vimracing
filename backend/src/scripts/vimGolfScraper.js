import https from 'https';
import { JSDOM } from 'jsdom';
import fs from 'fs';

const VIM_GOLF_PAGES_COUNT = 11;

// ============
main();
// ============

async function main() {
  const links = await getLinks();
  for (let link of links.slice(links.length - 66)) {
    console.log({ link });
    console.log('snippets left', links.length - links.indexOf(link));
    const snippets = await getSnippetsFromLink(link);
    fs.appendFileSync(
      './racesData/vimGolfSnippets.json',
      JSON.stringify(snippets) + ',\n'
    );
  }
}

function getSnippetsFromLink(link) {
  return new Promise((resolve, reject) => {
    https
      .get(`https://www.vimgolf.com${link}`, (resp) => {
        let data = '';
        resp.on('data', (dataChunk) => {
          data += dataChunk;
        });
        resp.on('end', () => {
          const { document } = new JSDOM(data).window;
          // we are assuming that there are 2 snippets per page (start, target)
          const snippets = [...document.querySelectorAll('.prettyprint')];
          const [start, target] = snippets.map((a) => a.textContent);
          resolve({
            start,
            target,
            source: `https://www.vimgolf.com${link}`
          });
        });
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      });
  });
}
async function getLinks() {
  const links = [];

  const requests = Array.from({ length: VIM_GOLF_PAGES_COUNT }, (_, i) => {
    return new Promise((resolve, reject) => {
      https
        .get(`https://www.vimgolf.com/?page=${i + 1}`, (resp) => {
          let data = '';
          resp.on('data', (dataChunk) => {
            data += dataChunk;
          });
          resp.on('end', () => {
            const { document } = new JSDOM(data).window;
            document.querySelectorAll('.challenge a').forEach((challenge) => {
              links.push(challenge.getAttribute('href'));
            });
            resolve();
          });
        })
        .on('error', (err) => {
          console.log(err);
          reject(err);
        });
    });
  });

  // Wait for all requests to complete
  await Promise.all(requests);

  return links;
}
