import Icon from 'vue-awesome/components/Icon.vue';
import Vue from 'vue';

import App from './App.vue';

Vue.component('v-icon', Icon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
