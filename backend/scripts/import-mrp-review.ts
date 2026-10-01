import { readFile } from 'node:fs/promises';
import { importMrpReview } from '../src/semantic/mrp-review.js';
const path = process.argv[2]; if (!path) throw new Error('Usage: import-mrp-review <json-file>'); const payload = JSON.parse(await readFile(path, 'utf8')); console.log(JSON.stringify(await importMrpReview(payload), null, 2));
