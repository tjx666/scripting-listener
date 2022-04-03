import vscode from 'vscode';
import { resolve } from 'path';
import { JSX_DIR } from '../constants';
import evalFile from '../extendscript';

export async function disableLog() {
    const scriptPath = resolve(JSX_DIR, 'disableLog.jsx');
    try {
        await evalFile(scriptPath);
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage('Disable Scripting Listener failed!');
    }
    vscode.window.showInformationMessage('Disable Scripting Listener success!');
}
