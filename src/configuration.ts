import { Encoding } from 'crypto';
import vscode, { ExtensionContext } from 'vscode';

class Configuration {
    static configuration = new Configuration();
    globalStoragePath = '';
    codeBlockCount?: number;
    parsedLinesCountPerCodeBlock?: number;
    logFileEncoding?: Encoding;
    psAppFolderPath?: string;

    private constructor() {
        this.update();
    }

    update(extensionContext?: ExtensionContext) {
        const latestConfiguration = vscode.workspace.getConfiguration('ScriptingListener');
        if (extensionContext) {
            this.globalStoragePath = extensionContext.globalStorageUri.fsPath;
            this.codeBlockCount = latestConfiguration.get('codeBlockCount')!;
            this.parsedLinesCountPerCodeBlock = latestConfiguration.get(
                'parsedLinesCountPerCodeBlock',
            )!;
            this.logFileEncoding = latestConfiguration.get('logFileEncoding')!;
            this.psAppFolderPath = latestConfiguration.get('psAppFolderPath');
        }
    }
}

export default Configuration.configuration;
