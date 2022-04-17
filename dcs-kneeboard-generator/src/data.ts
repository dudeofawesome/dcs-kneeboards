import type { Kneeboard } from './types/kneeboard';
let yaml;
try {
  yaml = require(process.env.kneeboard_path ?? '');
} catch (_) {
  console.log(_);
  yaml = JSON.parse(process.env.kneeboard ?? '');
}
console.log('YAML AS FOLLOWS:');
console.log(yaml);

export const data: Kneeboard = yaml;
