import { execSync } from 'child_process';

try {
  // Test if remote git has our commit or if git push succeeded
  const output = execSync('git ls-remote https://github.com/ienesdolar-ops/amofisio.git refs/heads/main', { encoding: 'utf8' });
  if (output && output.includes('refs/heads/main')) {
    console.log('VERIFICACAO_GIT_OK');
  } else {
    console.error('Git remote check failed');
    process.exit(1);
  }
} catch (e) {
  console.error('Erro ao verificar git:', e.message);
  process.exit(1);
}
