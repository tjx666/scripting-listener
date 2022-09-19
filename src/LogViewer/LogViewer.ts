import fs from 'fs/promises';
import vscode from 'vscode';

import { SCRIPTING_LISTENER_LOG_PATH, __DEV__ } from '../constants';
import { getNonce } from '../utils';
import logWatcher from './LogWatcher';

export class LogViewer {
    public static readonly viewType = 'ScriptingListenerLogViewer';
    public static currentLogViewer: LogViewer | undefined;

    private readonly extensionUri: vscode.Uri;
    private readonly disposables: vscode.Disposable[] = [];
    private panel: vscode.WebviewPanel | undefined;
    private html = '';

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (LogViewer.currentLogViewer) {
            LogViewer.currentLogViewer.panel!.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            LogViewer.viewType,
            'Scripting Listener',
            column ?? vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [extensionUri],
                retainContextWhenHidden: true,
            },
        );
        logWatcher.start();

        LogViewer.currentLogViewer = new LogViewer(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel;
        this.extensionUri = extensionUri;

        // setup listeners
        this.panel.onDidDispose(() => this.dispose(), this, this.disposables);
        this.panel.webview.onDidReceiveMessage(this.handleWebViewMessage, this, this.disposables);
        logWatcher.watch(this.updateCodeBlocks.bind(this));
        this.disposables.push(logWatcher);

        // Set the webview's initial html content
        this.setupHtmlForWebview(this.panel.webview);
    }

    private async handleWebViewMessage(message: any) {
        switch (message.command) {
            case 'scriptingListener.reload':
                vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
                return;
            case 'scriptingListener.refresh': {
                const parsedCodeBlocks = await logWatcher.getParsedCodeBlocks();
                await this.updateCodeBlocks(parsedCodeBlocks);
                return;
            }
            case 'scriptingListener.enableLogging': {
                vscode.commands.executeCommand('scriptingListener.enableScriptingListenerLog');
                return;
            }
            case 'scriptingListener.disableLogging': {
                vscode.commands.executeCommand('scriptingListener.disableScriptingListenerLog');
                return;
            }
            case 'scriptingListener.clear': {
                await fs.writeFile(SCRIPTING_LISTENER_LOG_PATH, '', { encoding: 'utf8' });
                return;
            }
        }
    }

    public async updateCodeBlocks(parsedCodeBlocks?: string[]) {
        this.panel?.webview.postMessage({
            command: 'scriptingListener.updateCodeBlocks',
            data: parsedCodeBlocks ?? (await logWatcher.getParsedCodeBlocks()),
        });
    }

    private setupHtmlForWebview(webview: vscode.Webview) {
        const scriptSrc = __DEV__
            ? 'http://localhost:3000/webview.js'
            : webview.asWebviewUri(
                  vscode.Uri.joinPath(this.extensionUri, 'dist', 'web', 'webview.js'),
              );
        const nonce = getNonce();
        const nonceAttr = __DEV__ ? '' : `nonce="${nonce}"`;
        const cspMeta = __DEV__
            ? ''
            : `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">`;

        this.html = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${cspMeta}
        <title>Scripting Listener</title>
    </head>
    <body>
        <div id="root"></div>
        <script ${nonceAttr} src="${scriptSrc}"></script>
    </body>
</html>`;
        if (this.panel?.webview) {
            this.panel.webview.html = this.html;
        }
    }

    private dispose() {
        LogViewer.currentLogViewer = undefined;
        this.panel = undefined;

        while (this.disposables.length > 0) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
