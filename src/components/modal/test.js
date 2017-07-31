import Vue from 'vue'
import testAlert from './test.vue';
const VueComponent = Vue.extend(testAlert);

export const tAlert = (message,onOk) =>{
	let vm = new VueComponent().$mount();
	vm.msg = message;
	vm.$on('onok',()=>{
		if(onOk) onOk();
		vm.show = true;
		console.log('确定2');
	});
	vm.$on('oncal',()=>{
		vm.show = false;
	    vm.$el.remove(() => {
	    	vm.$destroy();
	    })
	});
	document.body.appendChild(vm.$el);
	vm.show = true;
}

//调用方法
/*import { tAlert } from '@/components/modal/test.js';
tAlert('我是帅哥',()=>{
    console.log('食屎啦')
})*/