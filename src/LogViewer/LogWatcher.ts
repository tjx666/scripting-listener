import chokidar from 'chokidar';
// import { SCRIPTING_LISTENER_LOG_PATH } from '../constants';
const SCRIPTING_LISTENER_LOG_PATH = '/Users/yutengjing/Desktop/ScriptingListenerJS.log';

export default class LogWatcher {
    watch() {
        const watcher = chokidar.watch(SCRIPTING_LISTENER_LOG_PATH, {});
        watcher.on('change', (path, stats) => {
            console.log(path);
            console.log(stats?.size);
        });
    }
}

async function main() {
    const w = new LogWatcher();
    w.watch();
}

main();
