<template>
	<div class="slide-nav" :class="{'slide-nav-right': show,'slide-nav-left': !show}">
		<div class="nav-box">
			<div class="nav-header">
				<slot name="header"></slot>
			</div>
			<div class="nav-section">
				<slot name="section"></slot>
			</div>
		</div>
		<slot name="footer"></slot>
		<div class="toggle-slide-button" @click="toggleSlide" v-if="toggleBtn" :class="buttonClass"></div>
	</div>
</template>
<script>
export default {
	props: {
		buttonClass: {
			type: String,
			default: ''
		},
		toggleBtn: {
			type: Boolean,
			default: true
		},
		toggleClick: {
			type: Function,
			default: null
		}
	},
	data() {
		return {
			show: true,
			parentStyle: {
				overflow: {
					old: '',
					new: 'hidden'
				}
			}
		}
	},
	methods: {
		toggleSlide() {
			this.show = !this.show;
			if (this.toggleClick) this.toggleClick();
			if (this.show) {
				let time = setTimeout(() => {
					clearTimeout(time)
					this.$el.parentNode.style.overflow = this.parentStyle.overflow.old;
				}, 500);
			} else {
				this.$el.parentNode.style.overflow = this.parentStyle.overflow.new;
			}
		}
	}
}

</script>
