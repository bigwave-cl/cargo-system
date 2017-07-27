<template>
	<transition name="overlay-fade">
		<div class="bw-overlay" @click="handlerClick" :style="style"></div>
	</transition>
</template>
<script>
import { getZIndex } from '../utils/get-zindex.js';
export default {
	props: {
		opacity: {
			type: Number,
			default: .4
		},
		color: {
			type: String,
			default: '#000'
		},
		onClick: {
			type: Function
		},
		ask: {
			type: Boolean,
			default: false
		},
		askZIndex: {
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			zIndex: getZIndex()
		}
	},
	methods: {
		handlerClick() {
			if (this.onClick) {
				this.onClick();
			}
		}
	},
	computed: {
		style() {
			return {
				'opacity': this.opacity,
				'background-color': this.color,
				'z-index': this.ask ? this.askZIndex:this.zIndex
			}
		}
	}
}

</script>
