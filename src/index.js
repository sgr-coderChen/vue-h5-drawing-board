import DrawingBoard from './packages/index.vue';
import './assets/style/index.css'

const components = [ DrawingBoard ]

const install = (Vue) => {
    if (install.installed) return   // 判断是否安装注册过
    components.forEach(component => Vue.component(component.name, component)) // 遍历并注册组件
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue) // window中有Vue时去install()
}

export default {
    install
}
