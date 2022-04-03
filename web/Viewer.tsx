import { VSCodeButton, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import SyntaxHighlighter from 'components/syntaxHighlighter';
import { useLayoutEffect, useState } from 'react';

import { ReceivedCommand, SendedCommand } from './constants';

interface MessageData<T> {
    command: `scriptingListener.${string}`;
    data: T;
}

function send<T>(command: string, data?: MessageData<T>) {
    window.__vscode__.postMessage({
        command: `scriptingListener.${command}`,
        data,
    });
}

function refresh() {
    send(SendedCommand.Refresh);
}

export default function Viewer() {
    const [codeBlocks, setCodeBlocks] = useState<string[]>([]);
    const [reverseOrder, setReverseOrder] = useState(true);

    useLayoutEffect(() => {
        const handleMessage = (event: MessageEvent<MessageData<string[]>>) => {
            if (event.data.command === ReceivedCommand.UpdateCodeBlocks) {
                setCodeBlocks(event.data.data);
            }
        };
        window.addEventListener('message', handleMessage);

        // refresh when open webview or reload window
        refresh();

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleEnableLogging = () => {
        send(SendedCommand.EnableLogging);
        send(SendedCommand.Refresh);
    };

    const renderToolbar = () => {
        return (
            <div className="toolbar">
                <VSCodeButton onClick={handleEnableLogging}>Enable Logging</VSCodeButton>
                <VSCodeButton onClick={() => send(SendedCommand.DisableLogging)}>
                    Disable Logging
                </VSCodeButton>
                <VSCodeButton onClick={() => refresh()}>Refresh</VSCodeButton>
                <VSCodeButton onClick={() => setCodeBlocks([])}>Clear</VSCodeButton>
                <VSCodeCheckbox
                    checked={reverseOrder}
                    onChange={() => setReverseOrder(!reverseOrder)}
                >
                    Reverse Order Display
                </VSCodeCheckbox>
            </div>
        );
    };

    const renderList = (codeBlocks: string[]) => {
        const cbs = [...codeBlocks];
        if (!reverseOrder) {
            cbs.reverse();
        }

        return cbs.map((codeBlock, index) => {
            return <SyntaxHighlighter key={index} className="code-block" code={codeBlock} />;
        });
    };

    return (
        <div className="viewer">
            {renderToolbar()}
            {renderList(codeBlocks)}
        </div>
    );
}
