// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';



const config = {
    entry: {
        main: './src/index.ts',
        worker: './src/gl/worker.ts'
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            chunks: ['main']
        }),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                exclude: /\.(m|module)\.css$/,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(m|module)\.css$/i,
                use: [stylesHandler, {
                    loader: "css-loader",
                    options: {
                        modules: {
                            localIdentName: '[local]_[hash:base64:5]'
                        }
                    }
                },
            ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|wjs)$/i,
                type: 'asset',
            },
            {
                test: /\.(wjs)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(glsl)$/i,
                type: 'asset/source',
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        config.plugins.push(new MiniCssExtractPlugin());
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
