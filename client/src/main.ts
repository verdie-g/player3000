import Icon from 'vue-awesome/components/Icon.vue';
import Vue from 'vue';

import App from './App.vue';
import store from './store/index';

Vue.component('v-icon', Icon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
