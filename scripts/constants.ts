import { resolve as resolvePath } from 'path';

const PROJECT_ROOT = resolvePath(__dirname, '..');
const WEB_BUILD_DIR = resolvePath(PROJECT_ROOT, 'dist/web');
const isDev = process.env.NODE_ENV === 'development';

export { PROJECT_ROOT, WEB_BUILD_DIR, isDev };
