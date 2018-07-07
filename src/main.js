import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import { Loading, Notification } from 'element-ui';

import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;
locale.use(lang);
Vue.use(Loading.directive);
Vue.prototype.$notify = Notification;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
