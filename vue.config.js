module.exports = {
    css: {
        extract: false
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 处理字体
                    use: {
                        loader: 'file-loader'
                    }
                },
            ]
        }
    }
}