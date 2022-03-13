import pathUtils from 'path';
import vscode from 'vscode';

const EXTENSION_DIR = vscode.extensions.getExtension(
    'yutengjing.scripting-listener',
)!.extensionPath;
const JSX_DIR = pathUtils.resolve(EXTENSION_DIR, 'JSX');
const SYSTEM = process.platform === 'win32' ? 'Window' : 'MacOS';

export { EXTENSION_DIR, JSX_DIR, SYSTEM };