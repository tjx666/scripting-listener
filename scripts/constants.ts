import { resolve as resolvePath } from 'path';

const PROJECT_ROOT = resolvePath(__dirname, '..');
const BUILD_DIR = resolvePath(PROJECT_ROOT, '../build');
const isDev = process.env.NODE_ENV === 'development';

export { PROJECT_ROOT, BUILD_DIR, isDev };
