import type { Kneeboard } from './types/kneeboard';
let yaml;
try {
  yaml = require(process.env.kneeboard_path ?? '');
} catch (_) {
  console.log(_);
  yaml = JSON.parse(process.env.kneeboard ?? '');
}

export const data: Kneeboard = yaml;
