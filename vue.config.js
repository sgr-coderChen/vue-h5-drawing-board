module.exports = {
    css: {
        extract: false,  // 将组件里的css打入到umd.js中,不需要额外在安装插件后引入css (注意：公共style文件夹的样式需要在入口文件单独引入 src/index.js)
    },
    productionSourceMap: false, // 生产环境 去除 map文件
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.externals = {
                'vue': 'Vue',
            }
        }
    }
}