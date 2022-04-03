import FriendlyErrorsPlugin from '@nuxt/friendly-errors-webpack-plugin';
import { resolve } from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import WebpackBar from 'webpackbar';

import { BUILD_DIR, PROJECT_ROOT } from '../../constants';

const commonWebpackConfig: Configuration = {
    target: 'node',
    entry: resolve(PROJECT_ROOT, 'src/extension.ts'),
    infrastructureLogging: {
        level: 'log', // enables logging required for problem matchers
    },
    output: {
        library: {
            type: 'commonjs2',
        },
        path: BUILD_DIR,
        filename: 'extension.js',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    resolve: { extensions: ['.ts', '.js', '.json'] },
    externals: {
        vscode: 'commonjs vscode',
        fsevents: 'commonjs fsevents',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    configFile: resolve(PROJECT_ROOT, 'src/tsconfig.json'),
                },
            },
        ],
    },
    plugins: [
        new WebpackBar({
            name: 'Build VSCode Extension',
            color: '#0066B8',
        }),
        new FriendlyErrorsPlugin(),
        new DefinePlugin({
            VSCODE_EXTENSION_ENV: `'${process.env.NODE_ENV}'`,
        }),
    ],
};

export default commonWebpackConfig;
