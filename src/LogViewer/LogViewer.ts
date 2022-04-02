import vscode from 'vscode';
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
            LogViewer.currentLogViewer.panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            LogViewer.viewType,
            'Scripting Listener',
            column ?? vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [],
                retainContextWhenHidden: true,
            },
        );

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
        this.setupHtmlForWebview();
    }

    private async handleWebViewMessage(message: any) {
        switch (message.command) {
            case 'reload':
                vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
                return;
            case 'scriptingListener.refresh': {
                const parsedCodeBlocks = await logWatcher.getParsedCodeBlocks();
                await this.updateCodeBlocks(parsedCodeBlocks);
                return;
            }
        }
    }

    private async updateCodeBlocks(parsedCodeBlocks: string[]) {
        this.panel.webview.postMessage({
            command: 'scriptingListener.updateCodeBlocks',
            data: parsedCodeBlocks,
        });
    }

    private setupHtmlForWebview() {
        this.html = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Scripting Listener</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="http://localhost:3000/webview.js"></script>
    </body>
</html>`;
        this.panel.webview.html = this.html;
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
