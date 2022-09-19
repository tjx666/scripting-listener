import HighlightJS from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { memo, useCallback, useLayoutEffect, useRef } from 'react';

import './style.less';

HighlightJS.registerLanguage('javascript', javascript);

interface SyntaxHighlighterProps {
    className?: string;
    code: string;
}

function SyntaxHighlighter({ className = '', code }: SyntaxHighlighterProps) {
    const codeElementRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        HighlightJS.highlightElement(codeElementRef.current!);
    }, [code]);

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(code);
    }, [code]);

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
