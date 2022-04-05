import * as vscode from 'vscode';
import configuration from './configuration';
import type { LogViewer } from './LogViewer/LogViewer';

export function activate(context: vscode.ExtensionContext): void {
    configuration.update(context);

    let logViewer: LogViewer | undefined;

    context.subscriptions.push(
        vscode.commands.registerCommand('scriptingListener.enableScriptingListenerLog', () => {
            import('./switchLog/enable').then(({ enableLog }) => enableLog());
        }),
        vscode.commands.registerCommand('scriptingListener.disableScriptingListenerLog', () => {
            import('./switchLog/disable').then(({ disableLog }) => disableLog());
        }),

        vscode.commands.registerCommand('scriptingListener.openLogViewer', () => {
            import('./LogViewer/LogViewer').then(({ LogViewer }) => {
                LogViewer.createOrShow(context.extensionUri);
                logViewer = LogViewer.currentLogViewer;
            });
        }),

        vscode.commands.registerCommand('scriptingListener.openLogFile', () => {
            import('./openLogFile').then(({ openLogFile }) => openLogFile());
        }),

        vscode.workspace.onDidChangeConfiguration(() => {
            configuration.update(context);
            logViewer?.updateCodeBlocks();
        }),
    );
}

export function deactivate(): void {
    // recycle resource...
}
