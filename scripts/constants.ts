import { resolve as resolvePath } from 'path';

const __DEV__ = process.env.NODE_ENV === 'development';
const PROJECT_ROOT = resolvePath(__dirname, '..');
const BUILD_DIR = resolvePath(PROJECT_ROOT, 'dist');
const WEB_BUILD_DIR = resolvePath(BUILD_DIR, 'web');
const WEB_HOST = 'localhost';
const WEB_PORT = 3000;

export { __DEV__, BUILD_DIR, PROJECT_ROOT, WEB_BUILD_DIR, WEB_HOST, WEB_PORT };
