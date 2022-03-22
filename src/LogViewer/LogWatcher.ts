import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs/promises';
import iconv from 'iconv-lite';

import DescriptorParser from './DescriptorParser';
import { SCRIPTING_LISTENER_LOG_PATH } from '../constants';
import { debounce } from '../utils';

const SEPARATOR = '// =======================================================';

class LogWatcher {
    public static readonly logWatcher = new LogWatcher();

    private watcher: FSWatcher;
    private descriptorParser: DescriptorParser;

    private constructor() {
        this.watcher = chokidar.watch(SCRIPTING_LISTENER_LOG_PATH, {});
        this.descriptorParser = new DescriptorParser();
    }

    async getParsedCodeBlocks() {
        const logBuffer = await fs.readFile(SCRIPTING_LISTENER_LOG_PATH);
        const logText = iconv.decode(logBuffer, 'gbk');
        const codeBlocks = logText.split(SEPARATOR);
        const parsedCodeBlocks: string[] = [];
        const parseCount = 3;
        let parsedCount = 0;
        for (let i = codeBlocks.length - 1; i >= 0; i--) {
            const codeBlock = codeBlocks[i];
            if (codeBlock.trim() === '') continue;

            const paredCodeBlock = this.descriptorParser.cleanJSX(
                this.descriptorParser.cleanVariables(codeBlock),
            );
            parsedCodeBlocks.push(paredCodeBlock);
            parsedCount++;
            if (parsedCount === parseCount) break;
        }
        return parsedCodeBlocks;
    }

    watch(handler: (parsedCodeBlocks: string[]) => Promise<void>) {
        const handleChange = async () => {
            const parsedCodeBlocks = await this.getParsedCodeBlocks();
            await handler(parsedCodeBlocks);
        };
        handleChange();
        this.watcher.on('change', debounce(handleChange, 100, true));
    }

    dispose() {
        this.watcher.close();
    }
}

export default LogWatcher.logWatcher;
