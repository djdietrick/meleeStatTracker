import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'

Vue.config.productionTip = false;

Vue.prototype.$http = Axios;

// Access-Control-Allow-Origin:  http://127.0.0.1:3000
// Access-Control-Allow-Methods: POST
// Access-Control-Allow-Headers: Content-Type, Authorization

const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
