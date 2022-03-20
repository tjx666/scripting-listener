import { homedir } from 'os';
import path from 'path';
import vscode from 'vscode';

const EXTENSION_DIR = vscode.extensions.getExtension(
    'yutengjing.scripting-listener',
)!.extensionPath;
const JSX_DIR = path.resolve(EXTENSION_DIR, 'JSX');
const SYSTEM = process.platform === 'win32' ? 'Window' : 'MacOS';
const SCRIPTING_LISTENER_LOG_PATH = path.resolve(homedir(), 'Desktop/ScriptingListenerJS.log');

export { EXTENSION_DIR, JSX_DIR, SYSTEM, SCRIPTING_LISTENER_LOG_PATH };
