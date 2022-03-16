import webpack from 'webpack';
import WebpackDevServer, { Configuration as DevServerConfiguration } from 'webpack-dev-server';

import devConfig from './configs/web/webpack.dev';
import prodConfig from './configs/web/webpack.prod';
import { __DEV__, WEB_HOST, WEB_PORT } from './constants';

function start() {
    const compiler = webpack(devConfig);
    const devServerOptions: DevServerConfiguration = {
        hot: false,
        client: false,
        liveReload: false,
        host: WEB_HOST,
        port: WEB_PORT,
        open: false,
        devMiddleware: {
            stats: 'minimal',
        },
        allowedHosts: 'all',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        https: false,
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

if (__DEV__) {
    start();
} else {
    build();
}
