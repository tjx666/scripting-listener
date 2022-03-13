import { ExtensionContext } from 'vscode';

class Configuration {
    static configuration = new Configuration();
    globalStoragePath = '';

    private constructor() {
        this.update();
    }

    update(extensionContext?: ExtensionContext) {
        if (extensionContext) {
            this.globalStoragePath = extensionContext.globalStorageUri.fsPath;
        }
    }
}

export default Configuration.configuration;
