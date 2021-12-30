import DrawingBoard from './packages/index.vue';
import './assets/style/index.css' // 公共style 需要在入口文件额外引入

const components = [ DrawingBoard ]

const install = (Vue) => {
    if (install.installed) return   // 判断是否安装注册过
    components.forEach(component => Vue.component(component.name, component)) // 遍历并注册组件
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue) // window中有Vue时去install()
}

DrawingBoard.install = install

export default DrawingBoard
