import { VSCodeButton, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import SyntaxHighlighter from 'components/syntaxHighlighter';

import { MessageData, ReceivedCommand, send, SendedCommand } from './message';

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

    const handleEnableLogging = useCallback(() => {
        send(SendedCommand.EnableLogging);
        send(SendedCommand.Refresh);
    }, []);

    const handleClear = useCallback(() => {
        send(SendedCommand.Clear);
        send(SendedCommand.Refresh);
    }, []);

    const toolbar = useMemo(() => {
        return (
            <div className="toolbar">
                <VSCodeButton onClick={handleEnableLogging}>Enable Logging</VSCodeButton>
                <VSCodeButton onClick={() => send(SendedCommand.DisableLogging)}>
                    Disable Logging
                </VSCodeButton>
                <VSCodeButton onClick={() => refresh()}>Refresh</VSCodeButton>
                <VSCodeButton onClick={handleClear}>Clear</VSCodeButton>
                <VSCodeCheckbox
                    checked={reverseOrder}
                    onChange={() => setReverseOrder(!reverseOrder)}
                >
                    Reverse Order Display
                </VSCodeCheckbox>
            </div>
        );
    }, [handleClear, handleEnableLogging, reverseOrder]);

    const renderList = useCallback(
        (codeBlocks: string[]) => {
            const cbs = [...codeBlocks];
            if (!reverseOrder) {
                cbs.reverse();
            }

            return cbs.map((codeBlock, index) => {
                return <SyntaxHighlighter key={index} className="code-block" code={codeBlock} />;
            });
        },
        [reverseOrder],
    );

    return (
        <div className="viewer">
            {toolbar}
            {renderList(codeBlocks)}
        </div>
    );
}
