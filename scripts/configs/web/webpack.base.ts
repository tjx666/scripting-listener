import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve as resolvePath } from 'path';
import { Configuration } from 'webpack';

import { BUILD_DIR, isDev, PROJECT_ROOT } from '../../constants';

const webDir = resolvePath(PROJECT_ROOT, 'web');
const devEntries = ['webpack/hot/dev-server.js', 'webpack-dev-server/client/index.js?hot=true'];

const configuration: Configuration = {
    entry: [...(isDev ? devEntries : []), resolvePath(webDir, 'index.tsx')],
    output: {
        path: BUILD_DIR,
        filename: 'js/[name].js',
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
        new HtmlWebpackPlugin({
            template: resolvePath(webDir, 'public/index.html'),
            minify: isDev
                ? false
                : { minifyJS: true, removeComments: true, collapseWhitespace: true },
        }),
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