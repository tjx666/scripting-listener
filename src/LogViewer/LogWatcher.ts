import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs/promises';

import DescriptorParser from './DescriptorParser';
import { SCRIPTING_LISTENER_LOG_PATH } from '../constants';
import { debounce } from '../utils';
import configuration from '../configuration';

class LogWatcher {
    public static readonly logWatcher = new LogWatcher();

    private watcher: FSWatcher;
    private descriptorParser: DescriptorParser;

    private constructor() {
        this.watcher = chokidar.watch(SCRIPTING_LISTENER_LOG_PATH, {});
        this.descriptorParser = new DescriptorParser();
    }

    async getParsedCodeBlocks() {
        let logText = '';
        const encoding = configuration.logFileEncoding!;
        if (encoding === 'utf-8' || encoding === 'utf8') {
            logText = await fs.readFile(SCRIPTING_LISTENER_LOG_PATH, { encoding: 'utf-8' });
        } else {
            const iconv = await import('iconv-lite');
            const logBuffer = await fs.readFile(SCRIPTING_LISTENER_LOG_PATH);
            logText = iconv.decode(logBuffer, configuration.logFileEncoding!);
        }
        return this.descriptorParser.parse(logText, configuration.codeBlockCount!);
    }

    watch(handler: (parsedCodeBlocks: string[]) => Promise<void>) {
        const handleChange = async () => {
            const parsedCodeBlocks = await this.getParsedCodeBlocks();
            await handler(parsedCodeBlocks);
        };
        this.watcher.on('change', debounce(handleChange, 100, true));
    }

    dispose() {
        this.watcher.close();
    }
}

export default LogWatcher.logWatcher;
