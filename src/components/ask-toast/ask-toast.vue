<template>
	<transition name="ask-toast-fade">
		<div class="ask-toast" :style="{'z-index': zIndex}">
			<slot>
				<div class="msg" v-if="msg">{{msg}}</div>
			</slot>
		</div>
	</transition>
</template>
<script>
/**
 * use: <ask-toast v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
 * data: 
 */

import { getZIndex } from '../utils/get-zindex.js';
export default {
	props: {
		msg: {
			type: String,
			default: ''
		}
	},
	computed:{
		zIndex() {
			return 2017201720;
		}
	}
}
</script>
