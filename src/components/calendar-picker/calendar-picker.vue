<template>
	<div class="calendar-picker">
		<div class="calendar-label" @click="showCalendar()">{{value}}</div>
		<overlay v-if="show" :on-click="hideCalendar"></overlay>
		<transition name="calendar-select">
			<calendar-box v-if="show" @calendar-cancel="hideCalendar" :time="time" @calendar-sure="select"></calendar-box>
		</transition>
	</div>
</template>
<script>
/**
 * use: <calendar-picker class="inline-calendar" :value="nowTime" @calendar-callback="calendarChange"></calendar-picker>
 * data:
 * value: 对外显示的文本
 * calendar-callback： 日历控件时间重新选择并关闭之后的回调
 */
import moment from 'moment';
import calendarBox from './calendar-box';
export default {
	props: {
		value: {
			type: String,
			default: () => moment().format("YYYY-MM-DD")
		}
	},
	data() {
		return {
			show: false,
			time: this.value
		}
	},
	computed: {},
	methods: {
		showCalendar() {
			this.show = true;
		},
		hideCalendar() {
			this.show = false;
		},
		select(time) {
			let a = moment(time, 'YYYY-MM-DD');
			let b = moment(this.time, 'YYYY-MM-DD');
			this.time = time;
			this.hideCalendar();
			if (a.diff(b) != 0) {
				this.$emit('calendar-callback', this.time);
			}
		}
	},
	components: {
		'calendar-box': calendarBox
	}
}

</script>
