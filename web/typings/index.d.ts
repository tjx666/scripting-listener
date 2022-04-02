import type { WebviewApi } from 'vscode-webview';

interface StateType {}

declare global {
    interface Window {
        __vscode__: WebviewApi<StateType>;
        __reload__: () => void;
    }
}
