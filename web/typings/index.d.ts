import { WebviewApi } from 'vscode-webview';

declare global {
    interface Window {
        __vscode__: WebviewApi;
        __reload__: () => void;
    }
}
