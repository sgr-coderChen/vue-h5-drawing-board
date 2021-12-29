import Vue from 'vue'
import App from './App.vue'
import DrawingBoard from '../lib/vue-drawing-board.umd'
// import '../lib/vue-drawing-board.css'
// import './assets/font/iconfont.css'


// import './assets/style/index.css'

Vue.config.productionTip = false
Vue.use(DrawingBoard)

new Vue({
  render: h => h(App)
}).$mount('#app')
