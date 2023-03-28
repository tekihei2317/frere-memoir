import bcrypt from "bcrypt";

const saltRounds = 10;

export function makeHash(plainText: string): string {
  return bcrypt.hashSync(plainText, saltRounds);
}

export function compareHash(plainText: string, hash: string): boolean {
  return bcrypt.compareSync(plainText, hash);
}
