import { resolve } from 'path';
import { JSX_DIR } from '../constants';
import evalFile from '../extendscript';

export function disableLog() {
    const scriptPath = resolve(JSX_DIR, 'disableLog.jsx');
    return evalFile(scriptPath);
}
