<template>
	<div class="ask-prompt-box">
		<div class="prompt-label" @click="showPrompt()">{{value}}</div>
		<modal :show="show" :overlay="overlay" :overlayOpacity="overlayOpacity" :overlayColor="overlayColor" :hideClose="hideClose" :title="title" @modal-cancel="hidePrompt" v-if="show">
			<div class="prompt-box">
				<input type="text" :placeholder="placeholder" v-model="input">
			</div>
			<ask-button slot="footer" :text="'取消'" @ask-click="hidePrompt"></ask-button>
			<ask-button slot="footer" :text="'确定'" @ask-click="select"></ask-button>
		</modal>
		<ask-toast v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
	</div>
</template>
<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		value: {
			type: [String, Number],
			default: ''
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
		placeholder: {
			type: String,
			default: '请输入'
		},
		type: {
			type: String,
			default: 'text'
		},
		maxLength: {
			type: Number,
			default: null
		},
		minLength: {
			type: Number,
			default: null
		}
	},
	data() {
		return {
			show: false,
			input: '',
			askToast: []
		}
	},
	created() {
		this.input = this.value;
	},
	methods: {
		showPrompt() {
			this.show = true;
		},
		hidePrompt() {
			this.show = false;
		},
		select() {
			if (this.input == '') {
				this.toastShow('值不能为空！');
				return;
			}
			this.$emit('callback', this.input, this.value);
			this.hidePrompt();
		},
		toastShow(text, callback = () => {}) {
			this.askToast.push({
				msg: text,
				callback: callback
			})
			setTimeout(() => {
				this.askToast[0].callback();
				this.askToast.splice(0, 1);
			}, 2000);
		}
	},
	watch: {
		'input': function(n, o) {
			if (this.type === 'number') {
				n = '' + n;
				n = n.replace(/\D/g, '');
				if (n != '') n = parseInt(n, 10);
				if (n != '' && this.minLength != null) {
					n = Math.max(n, this.minLength);
				}
				if (n != '' && this.maxLength != null) {
					n = Math.min(n, this.maxLength);
				}
			}
			this.input = n;
		},
		'value': function (n,o){
			this.input = n;
		}
	}
}

</script>
