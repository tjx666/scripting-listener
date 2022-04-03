import fs from 'fs/promises';
import pathUtils from 'path';

import { execa } from 'execa';
import { stringify } from 'javascript-stringify';

import { EXTENSION_DIR } from './constants';
import { dateFormat, escapeStringAppleScript, pathExists, uuidV4 } from './utils';
import configuration from './configuration';

/**
 * find host app path, only support MacOS
 * @param appName like: Adobe Photoshop
 * @returns Adobe Photoshop 2021.app
 */
async function findApp(appName: string) {
    const appsDir = '/Applications';
    const appFolderNames = await fs.readdir(appsDir);

    const appFolderName = appFolderNames.find((folderName) => folderName.includes(appName));
    return appFolderName;
}

function getFileNameWithoutExt(path: string) {
    const basename = pathUtils.basename(path);
    return basename.slice(0, basename.lastIndexOf(pathUtils.extname(path)));
}

interface EvalFileOptions {
    argumentObject?: Record<string, any>;
    placeholders?: Record<string, any>;
}

async function evalFile(scriptPath: string, options?: EvalFileOptions) {
    const defaultOptions: EvalFileOptions = {
        argumentObject: {},
        placeholders: {},
    };
    options = Object.assign(defaultOptions, options);

    const app = await findApp('Adobe Photoshop');
    const uuid = uuidV4();

    const jsxOutputFolder = pathUtils.resolve(configuration.globalStoragePath, 'jsx/output');
    if (!(await pathExists(jsxOutputFolder))) {
        await fs.mkdir(jsxOutputFolder, { recursive: true });
    }
    const dateStr = dateFormat(new Date(), '%Y-%m-%d-%H:%M:%S', false);
    const jsxOutputFilePath = pathUtils.resolve(
        jsxOutputFolder,
        `${dateStr}-${getFileNameWithoutExt(scriptPath)}-${uuid}.txt`,
    );

    // a script to inject some helper functions
    // for example: print function, which print string as result
    const injectApiScriptPath = pathUtils.resolve(EXTENSION_DIR, 'JSX/inject.jsx');
    const injectApiScript = await fs.readFile(injectApiScriptPath, 'utf8');
    let script = await fs.readFile(scriptPath, 'utf8');
    script = injectApiScript.replace('// ${executeScriptCode}', script);

    // args
    if (options.argumentObject) {
        const argumentObjectStr = stringify(options.argumentObject, null, 4)!;
        script = script.replace('// ${args}', `var args = ${argumentObjectStr};`);
    }

    // placeholders
    script = script.replaceAll('__output_file__', `"${jsxOutputFilePath}"`);
    for (const [key, value] of Object.entries(options.placeholders!)) {
        script = script.replaceAll(`__${key}__`, value);
    }

    const appleScriptsFolder = pathUtils.resolve(configuration.globalStoragePath, 'apple_scripts');
    if (!(await pathExists(appleScriptsFolder))) {
        await fs.mkdir(appleScriptsFolder, { recursive: true });
    }
    const appleScriptPath = pathUtils.resolve(
        appleScriptsFolder,
        `${dateStr}-ps-command-${uuid}.scpt`,
    );
    // see: https://community.adobe.com/t5/photoshop-ecosystem-discussions/running-a-jsx-script-with-applescript-in-photoshop-using-do-javascript/td-p/11035403
    const appleScript = `tell application "${app}"
	activate
	do javascript "${escapeStringAppleScript(script)}"
end tell`;
    await Promise.all([
        await fs.writeFile(jsxOutputFilePath, '', 'utf8'),
        await fs.writeFile(appleScriptPath, appleScript, 'utf8'),
    ]);

    let result: any;
    await execa('osascript', [appleScriptPath]);
    const output = await fs.readFile(jsxOutputFilePath, 'utf8');
    try {
        result = JSON.parse(output);
    } catch {
        return output;
    }

    // if execute failed, keep the scripts
    await Promise.all([fs.rm(appleScriptPath), fs.rm(jsxOutputFilePath)]);

    return result;
}

export default evalFile;
