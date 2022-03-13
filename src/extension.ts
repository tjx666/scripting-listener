import * as vscode from 'vscode';
import configuration from './configuration';

export function activate(context: vscode.ExtensionContext): void {
    configuration.update(context);
    context.subscriptions.push(
        vscode.commands.registerCommand('scriptingListener.enableScriptingListenerLog', () => {
            import('./switchLog/enable').then(({ enableLog }) => enableLog());
        }),
        vscode.commands.registerCommand('scriptingListener.disableScriptingListenerLog', () => {
            import('./switchLog/disable').then(({ disableLog }) => disableLog());
        }),
    );
}

export function deactivate(): void {
    // recycle resource...
}
