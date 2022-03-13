import { resolve } from 'path';
import { JSX_DIR } from '../constants';
import evalFile from '../script';

export function enableLog() {
    const scriptPath = resolve(JSX_DIR, 'enableLog.jsx');
    return evalFile(scriptPath);
}
