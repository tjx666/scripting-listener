import vscode from 'vscode';
import { resolve } from 'path';
import { JSX_DIR } from '../constants';
import evalFile from '../extendscript';

export async function enableLog() {
    const scriptPath = resolve(JSX_DIR, 'enableLog.jsx');
    try {
        await evalFile(scriptPath);
    } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage('Enable Scripting Listener failed!');
    }
    vscode.window.showInformationMessage('Enable Scripting Listener success!');
}
