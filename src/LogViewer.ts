import vscode, { Uri } from 'vscode';

export default class LogViewer {
    public static readonly viewType = 'LogViewer';
    public static currentPanel: LogViewer | undefined;

    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private readonly disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (LogViewer.currentPanel) {
            LogViewer.currentPanel.panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            LogViewer.viewType,
            'Scripting Listener',
            column ?? vscode.ViewColumn.One,
            getWebviewOptions(extensionUri),
        );

        LogViewer.currentPanel = new LogViewer(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel;
        this.extensionUri = extensionUri;

        // Set the webview's initial html content
        this.setupHtmlForWebview();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this.disposables,
        );
    }

    private setupHtmlForWebview() {
        const webview = this.panel.webview;
        const nonce = getNonce();
        const isProd = false;
        const localPort = 3000;
        const localServerUrl = `localhost:${localPort}`;
        const scriptRelativePath = 'js/main.js';
        const scriptUri = isProd
            ? webview
                  .asWebviewUri(Uri.joinPath(this.extensionUri, 'build', scriptRelativePath))
                  .toString()
            : `http://${localServerUrl}/${scriptRelativePath}`;

        // prettier-ignore
        const csp = [
            `default-src 'none'`,
            `img-src ${webview.cspSource} 'self' 'unsafe-inline'`,
            `script-src ${isProd ? `'nonce-${nonce}'` : `http://${localServerUrl} http://0.0.0.0:${localPort}`} 'unsafe-eval'`,
            `style-src ${webview.cspSource} 'self' 'unsafe-inline'`,
            `font-src ${webview.cspSource}`,
            `connect-src ${isProd ? '' : `ws://${localServerUrl} ws://0.0.0.0:${localPort} http://${localServerUrl} http://0.0.0.0:${localPort}`}`
        ];
        const html = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="${csp.join('; ')}">
        <title>Scripting Listener</title>
    </head>
    <body>
        <div id="root"></div>
        <script ${isProd ? `nonce="${nonce}"` : ''} src="${scriptUri}"></script>
    </body>
</html>`;
        this.panel.webview.html = html;
    }

    public dispose() {
        LogViewer.currentPanel = undefined;

        // Clean up our resources
        this.panel.dispose();

        while (this.disposables.length > 0) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
    return {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'build')],
    };
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
