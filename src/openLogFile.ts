import vscode from 'vscode';
import { SCRIPTING_LISTENER_LOG_PATH } from './constants';

export async function openLogFile() {
    const openPath = vscode.Uri.file(SCRIPTING_LISTENER_LOG_PATH);
    const doc = await vscode.workspace.openTextDocument(openPath);
    // treat .log file as javascript file
    await vscode.languages.setTextDocumentLanguage(doc, 'javascript');
    await vscode.window.showTextDocument(doc);
}
