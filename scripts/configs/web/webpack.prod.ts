import TerserPlugin from 'terser-webpack-plugin';
import merge from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import baseConfig from './webpack.base';
import args from '../../args';

const prodConfig = merge(baseConfig, {
    mode: 'production',
    plugins: [
        ...(args.analyze
            ? [
                  new BundleAnalyzerPlugin({
                      analyzerPort: 3000,
                  }) as any,
              ]
            : []),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
            }),
        ],
    },
});

export default prodConfig;
