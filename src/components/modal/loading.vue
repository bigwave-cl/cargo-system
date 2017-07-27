<template>
	<div class="loading-box" v-if="show">
		<transition name="loading-fade">
			<div class="loading-circle" :style="{'z-index': zIndex}">
			</div>
		</transition>
		<overlay :opacity="overlayOpacity" :color="overlayColor" :ask="true" :ask-z-index="zIndex-1"></overlay>
	</div>
</template>

<script>
/**
 * use: <loading v-for="load in loading" :show="load.show" :key="load"></loading>
 * data: 
 */
export default{
	props: {
		show: {
			type: Boolean,
			default: false
		},
		overlayOpacity: {
			type: Number,
			default: 0.4
		},
		overlayColor: {
			type: String,
			default: '#000'
		}
	},
	computed:{
		zIndex() {
			return 2017201720;
		}
	}
}
</script>
