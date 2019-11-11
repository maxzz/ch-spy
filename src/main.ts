import Vue from 'vue';
import store from './store';
import VueCompositionApi from '@vue/composition-api';
import VueHooks from '@u3u/vue-hooks';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueHooks);
Vue.use(VueCompositionApi);

new Vue({
    store,
    render: h => h(App)
}).$mount('#app');
