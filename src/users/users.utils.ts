import { createHash } from 'crypto';

export const getHashedPassword = (password: string) =>
  createHash('md5').update(password).digest('hex');
