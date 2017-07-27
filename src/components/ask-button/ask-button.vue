<template>
	<a href="javascript:void(0);" class="ask-button" @click="handlerClick">
		<slot>
			<!-- <icon v-if="icon" :value="icon"></icon> -->
			<span class="button-text" v-if="text">
				{{text}}
			</span>
		</slot>
	</a>
</template>

<script>
/**
 * use: <ask-button :text="取消" @ask-click="cancel"></ask-button>
 * data:
 * ask-click: 绑定点击函数
 */
export default{
	props: {
		text: {
			type: String,
			default: ''
		}
	},
	methods: {
		handlerClick(){
			this.$emit('ask-click');
		}
	}

}
</script>