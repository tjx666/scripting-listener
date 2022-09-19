export enum ReceivedCommand {
    UpdateCodeBlocks = 'scriptingListener.updateCodeBlocks',
}

export enum SendedCommand {
    EnableLogging = 'enableLogging',
    DisableLogging = 'disableLogging',
    Refresh = 'refresh',
    Clear = 'clear',
}

export interface MessageData<T> {
    command: `scriptingListener.${string}`;
    data: T;
}

export function send<T>(command: string, data?: MessageData<T>) {
    window.__vscode__.postMessage({
        command: `scriptingListener.${command}`,
        data,
    });
}
