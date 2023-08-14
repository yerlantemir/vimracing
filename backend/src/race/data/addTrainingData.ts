import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const racesDataPath = path.resolve(__dirname, '../../../racesData');

export const addRaceData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { password } = req.query;
  const { raceData } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    res.status(403).send();
    return;
  }

  const lastRaceIndex = (await fs.readdir(`${racesDataPath}`)).length;

  await fs.writeFile(
    `${racesDataPath}/${lastRaceIndex + 1}.json`,
    JSON.stringify(raceData)
  );

  res.status(200).send();
};
