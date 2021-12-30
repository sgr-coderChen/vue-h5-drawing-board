import Vue from 'vue'
import App from './App.vue'
import DrawingBoard from '../lib/vue-drawing-board.umd.min'
Vue.use(DrawingBoard)

// import './assets/style/index.css'

Vue.config.productionTip = false


new Vue({
  render: h => h(App)
}).$mount('#app')
