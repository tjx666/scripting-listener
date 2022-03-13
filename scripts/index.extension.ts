import webpack, { Stats } from 'webpack';

import args from './args';
import devWebpackConfig from './configs/extension/webpack.dev';
import prodWebpackConfig from './configs/extension/webpack.prod';

const isProd = process.env.NODE_ENV !== 'development';
const compiler = webpack(isProd ? prodWebpackConfig : devWebpackConfig);

function handler(error?: Error | null | undefined, stats?: Stats) {
    if (error) {
        console.error(error);
        return;
    }

    const prodStats = {
        preset: 'normal',
        colors: true,
    };

    console.log(stats?.toString(isProd ? prodStats : 'minimal'));
}

if (args.watch) {
    compiler.watch({}, handler);
} else {
    compiler.run(handler);
}
