#!/usr/bin/env bun
import bcrypt from 'bcryptjs';

const plain = process.argv[2];
if (!plain) {
  console.error('Usage: bun scripts/hash-password.ts <plain-password>');
  console.error('Prints two lines: the raw bcrypt hash, and the env-escaped form');
  console.error('(the env line escapes $ as \\$ so Bun/Vite env loaders do not expand it).');
  process.exit(1);
}

const hash = await bcrypt.hash(plain, 12);
const escaped = hash.replace(/\$/g, '\\$');
console.log('Raw hash:        ', hash);
console.log('For .env file:   ', `ADMIN_PASSWORD_HASH=${escaped}`);
