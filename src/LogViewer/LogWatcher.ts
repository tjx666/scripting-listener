import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs/promises';
import iconv from 'iconv-lite';

import DescriptorParser from './DescriptorParser';
import { SCRIPTING_LISTENER_LOG_PATH } from '../constants';
import { debounce } from '../utils';

class LogWatcher {
    public static readonly logWatcher = new LogWatcher();

    private watcher: FSWatcher;
    private descriptorParser: DescriptorParser;

    private constructor() {
        this.watcher = chokidar.watch(SCRIPTING_LISTENER_LOG_PATH, {});
        this.descriptorParser = new DescriptorParser();
    }

    async getParsedCodeBlocks() {
        // const logBuffer = await fs.readFile(SCRIPTING_LISTENER_LOG_PATH);
        // const logText = iconv.decode(logBuffer, 'gbk');
        const logText = await fs.readFile(SCRIPTING_LISTENER_LOG_PATH, { encoding: 'utf8' });
        return this.descriptorParser.parse(logText, 10);
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
