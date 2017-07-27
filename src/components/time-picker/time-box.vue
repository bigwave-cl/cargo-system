<template>
	<div class="time-picker-box" :style="{'z-index': zIndex}">
		<div class="ask-caption">
			时间选择
		</div>
		<div class="ask-picker">
			<div class="ask-hour-box">
				<ul>
					<li v-for=" (i,$i) in hourList" :key="i" :class="{'active':i.checked}" @click="setChecked('hour',i)">{{i.value}}</li>
				</ul>
			</div>
			<div class="ask-minute-box">
				<ul>
					<li v-for=" (i,$i) in minuteList" :key="i" :class="{'active':i.checked}" @click="setChecked('minute',i)">{{i.value}}</li>
				</ul>
			</div>
		</div>
		<div class="ask-operation">
			<ask-button @ask-click="cancel">取消</ask-button>
			<ask-button class="sure" @ask-click="sure">确定</ask-button>
		</div>
	</div>
</template>
<script>
import { getZIndex } from '../utils/get-zindex.js';
export default {
	props: {
		time: {
			type: String,
			default: ''
		}
	},
	data() {
		function initList(num) {
			let list = [];
			let count = num;
			while (count > 0) {
				count--;
				list.push({
					checked: false,
					value: count < 10 ? '0' + count : count
				});
			}
			return list;
		}
		return {
			hourList: initList(24),
			minuteList: initList(60)
		}
	},
	computed: {
		zIndex() {
			return getZIndex();
		}
	},
	created() {
		let _choseTime = this.time.split(':');
		this.hourList = this.hourList.map(index => {
			if (index.value == _choseTime[0]) {
				index.checked = true;
			}
			return index;
		});
		this.minuteList = this.minuteList.map(index => {
			if (index.value == _choseTime[1]) {
				index.checked = true;
			}
			return index;
		});
	},
	methods: {
		cancel() {
			this.$emit('cancel')
		},
		sure() {
			let _time = '';
			_time = this.hourList.filter(index => index.checked)[0].value;
			_time = _time + ':' + this.minuteList.filter(index => index.checked)[0].value;
			
			this.$emit('sure',_time);
		},
		setChecked(type, item) {
			if (type === 'hour') {
				this.hourList = this.hourList.map(index => {
					index.checked = false;
					if (index.value == item.value) {
						index.checked = true;
					}
					return index;
				});
			}
			if (type === 'minute') {
				this.minuteList = this.minuteList.map(index => {
					index.checked = false;
					if (index.value == item.value) {
						index.checked = true;
					}
					return index;
				});
			}
		}
	}
}

</script>
