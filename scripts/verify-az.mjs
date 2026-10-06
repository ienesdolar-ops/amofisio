import fs from 'fs';
import path from 'path';

const dataFile = path.resolve('data.js');
const content = fs.readFileSync(dataFile, 'utf8');

const sandbox = {};
const fn = new Function('sandbox', content + '; sandbox.DATA = AMO_FISIO_DATA;');
fn(sandbox);
const data = sandbox.DATA;

const names = data.units.map(u => u.name);

for (let i = 0; i < names.length - 1; i++) {
  const current = names[i];
  const next = names[i + 1];
  const cmp = current.localeCompare(next, 'pt-BR', { sensitivity: 'base' });
  if (cmp > 0) {
    console.error(`Erro de ordenação A-Z: "${current}" vem antes de "${next}"`);
    process.exit(1);
  }
}

console.log('ORDENACAO_AZ_OK');
