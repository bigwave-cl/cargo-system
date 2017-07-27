import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import * as config from './config.js';
import { API as api } from 'api'
import VueResource from 'vue-resource'
import VueComponents from './components';

Vue.prototype.$api = api;
Vue.prototype.$config = config;
Vue.prototype.$mapKey = config.mapKey;
Vue.prototype.$mapCenter = config.mapCenter;
Vue.prototype.$platformId = config.platformId;

Vue.use(VueResource);
Vue.use(VueComponents);

Vue.http.options = {
	emulateJSON: true,
	emulateHTTP: true,
	timeout: 10000
}

Vue.config.productionTip = false;

new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
})
