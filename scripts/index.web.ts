import webpack from 'webpack';
import WebpackDevServer, { Configuration as DevServerConfiguration } from 'webpack-dev-server';

import devConfig from './configs/web/webpack.dev';
import prodConfig from './configs/web/webpack.prod';
import { isDev } from './constants';

function start() {
    const compiler = webpack(devConfig);
    const port = 3600;
    const devServerOptions: DevServerConfiguration = {
        hot: false,
        client: false,
        liveReload: true,
        port,
        open: false,
        devMiddleware: {
            stats: 'minimal',
            writeToDisk: true,
        },
    };
    const server = new WebpackDevServer(devServerOptions, compiler);
    server.start();
}

function build() {
    const compiler = webpack(prodConfig);
    compiler.run((error, stats) => {
        if (error) {
            console.error(error);
            return;
        }

        console.log(stats?.toString('minimal'));
    });
}

if (isDev) {
    start();
} else {
    build();
}
