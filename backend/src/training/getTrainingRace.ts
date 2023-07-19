import { Router } from 'express';
import { SupportedLanguages } from '@vimracing/shared';
import { getRandomRaceData } from '../utils/getRandomRaceData';

const router = Router();

router.get('/', async (req, res) => {
  const params = req.query;
  const { raceLangs } = params;

  const result = {} as Record<SupportedLanguages, any>;

  try {
    for (const lang of raceLangs as SupportedLanguages[]) {
      result[lang] = await getRandomRaceData(lang);
    }
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal error');
  }
});

export default router;
