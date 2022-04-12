import type { Kneeboard } from './types/kneeboard';
const {
  default: yaml,
} = require('../../kneeboards/src/FA-18C/startup-checklist.yaml');

export const data: Kneeboard = yaml;
