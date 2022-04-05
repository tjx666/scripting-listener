import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { memo, useLayoutEffect, useRef } from 'react';

import './style.less';

hljs.registerLanguage('javascript', javascript);

interface SyntaxHighlighterProps {
    className?: string;
    code: string;
}

function SyntaxHighlighter({ className = '', code }: SyntaxHighlighterProps) {
    const codeElementRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        hljs.highlightElement(codeElementRef.current!);
    }, [code]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
    };

    return (
        <pre className={`syntax-highlighter ${className}`}>
            <code className="language-javascript" ref={codeElementRef}>
                {code}
            </code>
            <button className="copy" onClick={copyToClipboard}>
                Copy
            </button>
        </pre>
    );
}

export default memo(SyntaxHighlighter);
