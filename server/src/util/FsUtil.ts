import { promises as fs } from 'fs';

export async function createDirIfNotExists(path: string): Promise<boolean> {
  try {
    await fs.mkdir(path);
    return true;
  } catch (e) {
    return false;
  }
}
