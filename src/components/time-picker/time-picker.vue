<template>
	<div class="time-picker">
		<div class="time-label" @click="showTime()">{{time}}</div>
		<overlay v-if="show" :on-click="hideTime"></overlay>
		<transition name="time-select">
			<time-box v-if="show" :time="time" @cancel="hideTime" @sure="select"></time-box>
		</transition>
	</div>
</template>
<script>
import moment from 'moment';
import timeBox from './time-box';
	export default{
		props: {
			time: {
				type: String,
				default: ''
			}
		},
		data() {
			return{
				show:false
			}
		},
		methods: {
			showTime(){
				this.show = true;
			},
			hideTime(){
				this.show = false;
			},
			select(time){
				this.hideTime();
				this.$emit('callback',this.$el,time);
			}
		},
		components: {
			'time-box':timeBox
		}
	}
</script>