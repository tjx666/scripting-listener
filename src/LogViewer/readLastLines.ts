import fsAsync from 'fs/promises';
import fs from 'fs';
import type { Stats as FSStats } from 'fs';
import { pathExists } from '../utils';

function readPreviousChar(stat: FSStats, fd: number, currentCharacterCount: number) {
    return new Promise<string>((resolve, reject) => {
        fs.read(
            fd,
            Buffer.alloc(1),
            0,
            1,
            stat.size - 1 - currentCharacterCount,
            (err, _bytesRead, buffer) => {
                if (err) reject(err);
                // eslint-disable-next-line unicorn/prefer-code-point
                resolve(String.fromCharCode(buffer[0]));
            },
        );
    });
}

/**
 * Read in the last `n` lines of a file
 * @param filePath - file (direct or relative path to file.)
 * @param maxLineCount    - max number of lines to read in.
 * @param encoding        - specifies the character encoding to be used, or 'buffer'. defaults to 'utf8'.
 * @return {promise}  a promise resolved with the lines or rejected with an error.
 */
export default async function readLastLines(
    filePath: string,
    maxLineCount: number,
    encoding: BufferEncoding = 'utf8',
) {
    if (!(await pathExists(filePath))) {
        throw new Error('file does not exist');
    }

    const NEW_LINE_CHARACTERS = new Set(['\n']);
    const [fileStat, fileHandle] = await Promise.all([
        fsAsync.stat(filePath),
        fsAsync.open(filePath, 'r'),
    ]);
    let currentCharacterCount = 0;
    let lineCount = 0;
    let linesStr = '';

    async function readRecursive(): Promise<string> {
        if (linesStr.length > fileStat.size) {
            linesStr = linesStr.slice(Math.max(0, linesStr.length - fileStat.size));
        }

        if (linesStr.length >= fileStat.size || lineCount >= maxLineCount) {
            if (NEW_LINE_CHARACTERS.has(linesStr.slice(0, 1))) {
                linesStr = linesStr.slice(1);
            }
            fileHandle.close();
            return Buffer.from(linesStr, 'binary').toString(encoding);
        }

        const nextCharacter = await readPreviousChar(
            fileStat,
            fileHandle.fd,
            currentCharacterCount,
        );
        linesStr = nextCharacter + linesStr;
        if (NEW_LINE_CHARACTERS.has(nextCharacter) && linesStr.length > 1) {
            lineCount++;
        }
        currentCharacterCount++;
        return readRecursive();
    }

    return readRecursive();
}

async function main() {
    console.time('readLastLines');
    const testPath = '/Users/yutengjing/code/scripting-listener/package-lock.json';
    const lines = await readLastLines(testPath, 100, 'utf8');
    // console.log(`[${lines}]`);
    console.timeEnd('readLastLines');

    console.time('readFile');
    const content = await fsAsync.readFile(testPath, { encoding: 'utf8' });
    console.timeEnd('readFile');
}
main();
