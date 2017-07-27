<template>
	<modal :show="show" 
		   :overlay="overlay" 
		   :overlayOpacity="overlayOpacity"
		   :overlayColor="overlayColor"
		   :hideClose = "hideClose"
		   :title="title"
		   @modal-cancel="modalCancel"
		   v-if="show">
		<div class="confirm-box" v-if="msg">
			{{msg}}
		</div>
	    <ask-button slot="footer" :text="'取消'" @ask-click="cancel"></ask-button>
	    <ask-button slot="footer" class="confirm-sure" :text="'确定'" @ask-click="sure"></ask-button>
	</modal>
</template>

<script>
/**
 * use: <confirm :title="'小芳'" :msg="'12345'" :show="modalTest" @sure="comfirmSure" @cancel="confirmCancel"></confirm>
 * data: 
 */

export default{
	props: {
		title: {
			type: String,
			default: ''
		},
		show: {
			type: Boolean,
			default: false
		},
		overlay: {
			type: Boolean,
			default: true
		},
		overlayOpacity: {
			type: Number,
			default: 0.4
		},
		overlayColor: {
			type: String,
			default: '#000'
		},
		hideClose: {
			type: Boolean,
			default: false
		},
		msg: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			disabledButton: false
		}
	},
	methods: {
		modalCancel() {
			this.$emit('cancel');
		},
		sure(){
			this.$emit('sure');
		},
		cancel(){
			this.$emit('cancel');
		}
	}
}
</script>
