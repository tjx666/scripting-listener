import { useLayoutEffect, useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';

SyntaxHighlighter.registerLanguage('javascript', js);

interface MessageData<T> {
    command: string;
    data: T;
}

function refresh() {
    window.__vscode__.postMessage({
        command: 'scriptingListener.refresh',
    });
}

export default function App() {
    const [codeBlocks, setCodeBlocks] = useState<string[]>([]);

    useLayoutEffect(() => {
        const handleMessage = (event: MessageEvent<MessageData<string[]>>) => {
            if (event.data.command === 'scriptingListener.updateCodeBlocks') {
                setCodeBlocks(event.data.data);
            }
        };
        window.addEventListener('message', handleMessage);
        // refresh when open webview or reload window
        refresh();

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const renderList = (codeBlocks: string[]) => {
        return codeBlocks.map((codeBlock, index) => {
            return (
                <SyntaxHighlighter key={index} language="javascript" style={atomOneDark}>
                    {codeBlock}
                </SyntaxHighlighter>
            );
        });
    };

    return <div className="container">{renderList(codeBlocks)}</div>;
}
