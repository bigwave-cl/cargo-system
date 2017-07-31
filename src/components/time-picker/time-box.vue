<template>
	<div class="time-picker-box" :style="{'z-index': zIndex}">

		<div class="c-monthly">
			<div class="c-previous" v-if="showType == 2" >
				<ask-button class="type-btn" v-show="!timeSwitching" @ask-click="selectBegin">上一时段</ask-button>
			</div>
			<div class="c-caption">
				<span v-if="showType == 1">选择时间</span>
				<span v-if="showType == 2" v-text="timeSwitching ? '选择时间': '选择时间'"></span>
				<span class="time" v-text="timeFilter()"></span>
			</div>
			<div class="c-next" v-if="showType == 2">
				<ask-button class="type-btn" v-show="timeSwitching" @ask-click="selectEnd">下一时段</ask-button>
			</div>
		</div>
		<div class="ask-body">
			<transition name="time-picker-slide">
				<div class="ask-picker" v-show="timeSwitching">
					<div class="ask-hour-box">
						<ul>
							<li v-for=" (i,$i) in hourList" :key="$i" :class="{'active':i.checked}" @click="setChecked('hour','from',i)">{{i.value}}</li>
						</ul>
					</div>
					<div class="ask-minute-box">
						<ul>
							<li v-for=" (i,$i) in minuteList" :key="$i" :class="{'active':i.checked}" @click="setChecked('minute','from',i)">{{i.value}}</li>
						</ul>
					</div>
				</div>
			</transition>
			<transition name="time-picker-slide-left">
				<div class="ask-picker" v-if="showType == 2" v-show="!timeSwitching">
					<div class="ask-hour-box">
						<ul>
							<li v-for=" (i,$i) in toHourList" :key="$i" :class="{'active':i.checked}" @click="setChecked('hour','to',i)">{{i.value}}</li>
						</ul>
					</div>
					<div class="ask-minute-box">
						<ul>
							<li v-for=" (i,$i) in toMinuteList" :key="$i" :class="{'active':i.checked}" @click="setChecked('minute','to',i)">{{i.value}}</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<div class="ask-operation">
			<ask-button @ask-click="cancel">取消</ask-button>
			<ask-button class="sure" @ask-click="sure">确定</ask-button>
		</div>

        <ask-toast slot="footer" v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
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
			showType: 1,
			timeSwitching: true,
			hourList: initList(24),
			minuteList: initList(60),
			toHourList: initList(24),
			toMinuteList: initList(60),
			fromChoseTime:[],
			toChoseTime:[],
			askToast:[]
		}
	},
	computed: {
		zIndex() {
			return getZIndex();
		}
	},
	created() {
		let _choseTime = this.time.split(/[- ~]/);

		this.fromChoseTime = _choseTime[0].split(/[ : ]/);
		this.hourList = this.hourList.map(index => {
			if (index.value == this.fromChoseTime[0]) {
				index.checked = true;
			}
			return index;
		});
		this.minuteList = this.minuteList.map(index => {
			if (index.value == this.fromChoseTime[1]) {
				index.checked = true;
			}
			return index;
		});
		if(_choseTime.length >= 2){
			this.showType = 2;
			this.toChoseTime = _choseTime[1].split(/[ : ]/);
			this.toHourList = this.toHourList.map(index => {
				if (index.value == this.toChoseTime[0]) {
					index.checked = true;
				}
				return index;
			});
			this.toMinuteList = this.toMinuteList.map(index => {
				if (index.value == this.toChoseTime[1]) {
					index.checked = true;
				}
				return index;
			});
		}
	},
	methods: {
        toastShow(text, callback = () => {}) {
            this.askToast.push({
                msg: text,
                callback: callback
            })
            setTimeout(() => {
                this.askToast[0].callback();
                this.askToast.splice(0, 1);
            }, 2000);
        },
		cancel() {
			this.$emit('cancel')
		},
		sure() {
			let _time = '';
			_time = this.fromChoseTime[0]+':'+this.fromChoseTime[1];
			if(this.toChoseTime.length !== 0){
				_time += '~'+this.toChoseTime[0]+':'+this.toChoseTime[1];
			}

			this.$emit('sure',_time);
		},
		setChecked(type, timeSource , item) {
			let self  = this;
			if(timeSource == 'from'){
				self.fromHandler(type,item);
			}
			if(self.showType == 2 && timeSource == 'to'){
				self.toHandler(type,item);
			}
		},
		fromHandler(type,item){
			let self = this;
			if (type === 'hour') {
				let accord = true;
				if(self.showType == 2 && self.toChoseTime.length !== 0){
					if( parseInt(item.value,10) > parseInt(self.toChoseTime[0],10)){
						accord = false;
						self.toastShow('不能选择大于下一时段的值!');
					}else if(parseInt(item.value,10) == parseInt(self.toChoseTime[0],10) && 
							 parseInt(self.toChoseTime[1],10) <= parseInt(self.fromChoseTime[1],10)){
						accord = false;
						self.toastShow('不能选择大于下一时段的值!');
					}
				}
				if(!accord) return;
				self.hourList = self.hourList.map(index => {
					index.checked = false;
					if (index.value == item.value) {
						index.checked = true;
						self.fromChoseTime[0] = item.value;
					}
					return index;
				});
			}
			if (type === 'minute') {
				let accord = true;
				if(self.showType == 2 && self.toChoseTime.length !== 0){
					if(parseInt(self.toChoseTime[0],10) == parseInt(self.fromChoseTime[0],10) && 
					   parseInt(self.toChoseTime[1],10) <= parseInt(item.value,10)){
						accord = false;
						self.toastShow('不能选择大于下一时段的值!');
					}
				}
				if(!accord) return;
				self.minuteList = self.minuteList.map(index => {
					index.checked = false;
					if (index.value == item.value) {
						index.checked = true;
						self.fromChoseTime[1] = item.value;
					}
					return index;
				});
			}
		},
		toHandler(type,item){
			let self = this;
			if (type === 'hour') {
				let accord = true;
				if( parseInt(item.value,10) < parseInt(self.fromChoseTime[0],10)){
					accord = false;
					self.toastShow('不能选择小于上一时段的值!');
				}else if(parseInt(item.value,10) == parseInt(self.fromChoseTime[0],10) && 
						 parseInt(self.toChoseTime[1],10) <= parseInt(self.fromChoseTime[1],10)){
					accord = false;
					self.toastShow('不能选择小于上一时段的值!');
				}
				if(!accord) return;
				self.toHourList = self.toHourList.map(index => {
					index.checked = false;
					if (index.value == item.value) {
						index.checked = true;
						self.toChoseTime[0] = item.value;
					}
					return index;
				});
			}
			if (type === 'minute') {
				let accord = true;
				if(parseInt(self.toChoseTime[0],10) == parseInt(self.fromChoseTime[0],10) && 
				   parseInt(item.value,10) <= parseInt(self.fromChoseTime[1],10)){
					accord = false;
					self.toastShow('不能选择小于上一时段的值!');
				}
				if(!accord) return;
				self.toMinuteList = self.toMinuteList.map(index => {
					index.checked = false;
					if (index.value == item.value) {
						index.checked = true;
						self.toChoseTime[1] = item.value;
					}
					return index;
				});
			}
		},
		timeFilter(){
			if(this.toChoseTime.length == 0){
				return this.fromChoseTime[0]+':'+this.fromChoseTime[1];
			}else{
				return this.fromChoseTime[0]+':'+this.fromChoseTime[1]+'~'+this.toChoseTime[0]+':'+this.toChoseTime[1]
			}
		},
		selectBegin(){
			this.timeSwitching = true;
		},
		selectEnd(){
			this.timeSwitching = false;
		}
	}
}

</script>
