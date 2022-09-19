import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { resolve as resolvePath } from 'path';
import type { Configuration } from 'webpack';

import { __DEV__, PROJECT_ROOT, WEB_BUILD_DIR } from '../../constants';

const webDir = resolvePath(PROJECT_ROOT, 'web');
const devServerClientOptions = {
    hot: true,
    protocol: 'ws',
    hostname: 'localhost',
    port: 3000,
    pathname: 'ws',
};
const devServerClientParams = Object.entries(devServerClientOptions)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
const webpackHotDevServer = resolvePath(__dirname, './webpack-hot-dev-server.js');
const devEntries = [
    webpackHotDevServer,
    `webpack-dev-server/client/index.js?${devServerClientParams}`,
];

const configuration: Configuration = {
    entry: [...(__DEV__ ? devEntries : []), resolvePath(webDir, 'index.tsx')],
    output: {
        path: WEB_BUILD_DIR,
        filename: 'webview.js',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
            '@': resolvePath(webDir),
            assets: resolvePath(webDir, 'assets'),
            components: resolvePath(webDir, 'components'),
            features: resolvePath(webDir, 'redux/features'),
            pages: resolvePath(webDir, 'pages'),
            utils: resolvePath(webDir, 'utils'),
            reducers: resolvePath(webDir, 'redux/reducers'),
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: resolvePath(webDir, 'tsconfig.json'),
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                loader: 'babel-loader',
                options: { cacheDirectory: true },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.less$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
                generator: {
                    filename: 'images/[hash]-[name][ext][query]',
                },
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
                generator: {
                    filename: 'fonts/[hash]-[name][ext][query]',
                },
            },
        ],
    },
};

export default configuration;
