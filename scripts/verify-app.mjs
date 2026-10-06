import fs from 'fs';
import path from 'path';

const appFile = path.resolve('app.js');
const content = fs.readFileSync(appFile, 'utf8');

// Verificar se includes('última') ou similar está presente para cobrir singular e plural
const hasSingularCheck = content.includes("includes('última')") || content.includes('includes("última")') || content.includes("includes('ultima')");

if (!hasSingularCheck) {
  console.error("app.js deve verificar 'última' / 'ultima' para cobrir o selo no singular");
  process.exit(1);
}

console.log('VERIFICACAO_APP_OK');
