import { useLayoutEffect, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

interface MessageData<T> {
    command: string;
    data: T;
}

export default function App() {
    const [codeBlocks, setCodeBlocks] = useState<string[]>([]);

    useLayoutEffect(() => {
        const handleMessage = (event: MessageEvent<MessageData<string[]>>) => {
            if (event.data.command === 'scriptingListener.updateCodeBlocks') {
                setCodeBlocks(event.data.data);
                setTimeout(() => {
                    document.querySelectorAll('pre code').forEach((el) => {
                        hljs.highlightElement(el as HTMLElement);
                    });
                });
            }
        };
        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const renderList = (codeBlocks: string[]) => {
        return codeBlocks.map((codeBlock, index) => {
            return (
                <pre key={index}>
                    <code className="language-javascript">{codeBlock}</code>
                </pre>
            );
        });
    };

    return <div className="container">{renderList(codeBlocks)}</div>;
}
