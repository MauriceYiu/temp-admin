import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
// import OSS  from 'ali-oss'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import * as filters from './filters' // global filters
import App from './App'
import store from './store'
import router from './router'
import {upload} from "./utils/upload"

import '@/icons' // icon
import '@/permission' // permission control
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

// set ElementUI lang to EN
Vue.use(ElementUI, {})


Vue.config.productionTip = false
// Vue.use(OSS)
Vue.prototype.$upload = upload;
Vue.prototype.hasPerm = (permission) => {
  let myPermissions = JSON.parse(localStorage.getItem("permissions"));
  return myPermissions.indexOf(permission) > -1;
};

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    button: false,
    navbar: false,
    toolbar: false,
  }
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
