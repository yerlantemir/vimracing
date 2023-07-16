import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const racesDataPath = path.resolve(__dirname, '../../racesData');
const router = Router();

router.get('/', (req, res) => {
  const lang = 'js';

  const raceMaxIndex = fs.readdirSync(
    path.resolve(__dirname, `${racesDataPath}/${lang}`)
  ).length;
  const randomRaceId = Math.floor(Math.random() * raceMaxIndex);

  fs.readFile(
    `${racesDataPath}/${lang}/${randomRaceId}.json`,
    'utf8',
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      res.send(data);
    }
  );
});

export default router;
