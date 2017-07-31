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
			我是测试的弹框
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
	data() {
		return {
			disabledButton: false,
			title: '',
			show: false,
			overlay: true,
			overlayOpacity: .4,
			overlayColor: '#000',
			hideClose: false,
			msg: 'yiyi'
		}
	},
	methods: {
		modalCancel() {
			this.show = false;
		},
		sure(){
			console.log('确定');
			this.$emit('onok');
		},
		cancel(){
			console.log('取消');
			this.$emit('oncal');
		}
	}
}
</script>
