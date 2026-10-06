import { execSync } from 'child_process';

try {
  execSync('node -c app.js', { stdio: 'inherit' });
  execSync('node -c data.js', { stdio: 'inherit' });
  execSync('node scripts/verify-az.mjs', { stdio: 'inherit' });
  execSync('node scripts/verify-user-overrides.mjs', { stdio: 'inherit' });
  execSync('node scripts/verify-capacities.mjs', { stdio: 'inherit' });
  console.log('TODOS_TESTES_INTEGRIDADE_OK');
} catch (e) {
  process.exit(1);
}
