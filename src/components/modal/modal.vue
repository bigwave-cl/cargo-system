<template>
	<transition name="modal-scale">
		<div class="modal-box" v-if="show">
			<div class="modal-title" v-if="title">
				{{title}}
				<div class="close-icon" v-if="!closeIcon" @click="close">
					<span class="icon"></span>
				</div>
			</div>
			<div class="modal-body">
				<slot></slot>
			</div>
			<div class="modal-footer" v-if="!hideClose">
				<slot name="footer">
					<ask-button text="关闭" @ask-click="close"></ask-button>
				</slot>
			</div>
		</div>
	</transition>
</template>
<script>
/**
 * use: <modal :modal-class="confirmClass" 
		   :show="show" 
		   :overlay="overlay" 
		   :overlayOpacity="overlayOpacity"
		   :overlayColor="overlayColor"
		   :hideClose = "hideClose"
		   :title="title"
		   @modal-cancel="modalCancel"
		   v-if="show">
		<div class="confirm-box">
			我是confirm
		</div>
	    <ask-button slot="footer" text="取消" @ask-click="cancel"></ask-button>
	    <ask-button slot="footer" text="确定" @ask-click="sure"></ask-button>
	</modal>
 * data: 
 * modal-cancel: 关闭模态框的执行的函数
 */
import overlaySet from './modal-overlay.js'
export default {
	mixins: [overlaySet],
	props: {
		title: {
			type: String,
			default: ''
		},
		hideClose: {
			type: Boolean,
			default: false
		},
		closeIcon:{
			type:Boolean,
			default: true
		}
	},
	methods: {
		overlayClick() {
			this.$emit('modal-cancel');
		},
	  	close() {
	  	  	this.$emit('modal-cancel');
	  	}
	}
}

</script>
