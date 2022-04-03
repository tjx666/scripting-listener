import ReactDOM from 'react-dom';
import Viewer from './Viewer';
import './index.less';

if (window.__vscode__ === undefined) {
    window.__vscode__ = acquireVsCodeApi();
}

ReactDOM.render(<Viewer />, document.querySelector('#root'));
