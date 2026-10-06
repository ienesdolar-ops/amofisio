import fs from 'fs';
import { parseCSV } from './parse-briefing.mjs';

const content = fs.readFileSync('briefing_forms.csv', 'utf8');
const rows = parseCSV(content);

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r[6]) continue;
  const unit = r[6].trim();
  const theme = (r[7] || '').split('\n')[0].replace(/^Tema:\s*/i, '').trim();
  const cap = r[12] ? r[12].trim() : '';
  const min = r[13] ? r[13].trim() : '';
  console.log(`[${i}] ${unit} | ${theme.substring(0, 60)} | Cap: ${cap} | Min: ${min}`);
}
