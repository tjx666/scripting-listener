import { resolve as resolvePath } from 'path';

const PROJECT_ROOT = resolvePath(__dirname, '..');
const isDev = process.env.NODE_ENV === 'development';
const WEB_BUILD_DIR = resolvePath(PROJECT_ROOT, 'dist/web');
const WEB_HOST = 'localhost';
const WEB_PORT = 3000;

export { isDev, PROJECT_ROOT, WEB_BUILD_DIR, WEB_HOST, WEB_PORT };
