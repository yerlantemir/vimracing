import path from 'path';
import fs from 'fs';
import util from 'util';
import { SupportedLanguages } from '@vimracing/shared';
import { RaceDocs } from '@vimracing/shared';

const racesDataPath = path.resolve(__dirname, '../../racesData');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

export const getRandomRaceData = async (
  lang: SupportedLanguages
): Promise<RaceDocs> => {
  const files = await readdir(
    path.resolve(__dirname, `${racesDataPath}/${lang}`)
  );
  const raceMaxIndex = files.length;
  const randomRaceId = Math.floor(Math.random() * raceMaxIndex);

  const data = await readFile(`${racesDataPath}/js/7.json`, 'utf8');

  return JSON.parse(data);
};
