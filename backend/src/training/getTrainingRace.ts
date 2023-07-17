import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { SupportedLanguages } from '@vimracing/shared';
import util from 'util';

const racesDataPath = path.resolve(__dirname, '../../racesData');
const router = Router();

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
router.get('/', async (req, res) => {
  const params = req.query;
  const { raceLangs } = params;

  const result = {} as Record<SupportedLanguages, any>;

  try {
    for (const lang of raceLangs as SupportedLanguages[]) {
      const files = await readdir(
        path.resolve(__dirname, `${racesDataPath}/${lang}`)
      );
      const raceMaxIndex = files.length;
      const randomRaceId = Math.floor(Math.random() * raceMaxIndex);

      const data = await readFile(
        `${racesDataPath}/${lang}/${randomRaceId}.json`,
        'utf8'
      );
      result[lang as SupportedLanguages] = JSON.parse(data);
    }
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal error');
  }
});

export default router;
