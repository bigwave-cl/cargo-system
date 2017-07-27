<template>
	<div class="calendar-box" :style="{'z-index': zIndex}">
		<div class="c-monthly">
			<div class="c-previous" @click="changeMonth('pre')">
				<i class="icon arrow-left"></i>
			</div>
			<div class="c-caption">
				<a class="date-year" @click.prevent="showYear">{{checked.year}}</a>
				<a class="date-month" @click.prevent="showMonth">{{months[checked.month-1]}}</a>
			</div>
			<div class="c-next" @click="changeMonth('next')">
				<i class="icon arrow-right"></i>
			</div>
		</div>
		<div class="c-picker" v-if="showInfo.day">
			<div class="c-week">
				<ul>
					<li v-for="i in weeks">{{i}}</li>
				</ul>
			</div>
			<div class="c-days">
				<ul>
					<li v-for="i in dayList" :class="{'not-day': !i.inMonth}" @click="checkDay(i)">
						<span :class="{active: i.checked }">{{i.value}}</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="c-picker list-box" v-if="showInfo.month">
			<div class="c-block">
				<ul>
					<li v-for="(m,$i) in months" @click="setMonth($i)">
						{{m}}
					</li>
				</ul>
			</div>
		</div>
		<div class="c-picker list-box" v-if="showInfo.year" id="year_list">
			<div class="c-block">
				<ul>
					<li v-for="y in years" @click="setYear(y)">
						{{y}}
					</li>
				</ul>
			</div>
		</div>
		<div class="c-button">
			<button type="button" @click="dismiss">取消</button>
			<button type="button" @click="sure">确定</button>
		</div>
	</div>
</template>
<script>
/**
 * use: <calendar-box @calendar-cancel="hideCalendar" :format="YYYY-MM-DD" :time="time" @calendar-sure="select"></calendar-box>
 * data:
 * calendar-cancel: 日历控件点击取消执行的函数
 * calendar-sure：日历控件点击确定执行的函数
 * format： 时间格式
 * time：当前选中时间
 * 
 */
	import moment from 'moment';
	import { getZIndex } from '../utils/get-zindex.js';
	export default {
		props: {
			time: {
				type: String,
				required: true
			},
			format: {
				type: String,
				default: 'YYYY-MM-DD'
			}
		},
		data() {
			return {
				zIndex: getZIndex(),
				weeks: ['日', '一', '二', '三', '四', '五', '六'],
				months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
				years: [],
				checked: {
					oldtime: '',
					cur_moment: null,
					year: '',
					month: '',
					day: ''
				},
				selectedDays: '',
				dayList: [],
				showInfo: {
					year: false,
					month: false,
					day: false
				}
			}
		},
		methods: {
			dismiss() {
				this.$emit('calendar-cancel');
			},
			sure() {
				// this.time = moment(this.selectedDays).format('YYYY-MM-DD');
				this.$emit('calendar-sure', moment(this.selectedDays).format('YYYY-MM-DD'));
			},
			changeMonth(type) {
				let next = null
				type == 'next' ? next = moment(this.checked.cur_moment).add(1, 'M') : next = moment(this.checked.cur_moment).add(-1, 'M');
				this.initDay(next)
			},
			initDay(time) {
				if (!time) {
					this.checked.cur_moment = moment();
				} else {
					// this.checked.cur_moment = moment(time, this.format);
					this.checked.cur_moment = moment(time, this.format);
				}
				this.showWhat('day');
				this.checked.year = moment(this.checked.cur_moment).format("YYYY");
				this.checked.month = parseInt(moment(this.checked.cur_moment).format("MM"), 10);

				this.checked.day = moment(this.checked.cur_moment).format("DD");
				let currentMoment = this.checked.cur_moment;
				//每个月1号是星期几
				let firstDay = moment(currentMoment).date(1).day();
				//每个月有多少天
				let monthDays = moment(currentMoment).daysInMonth();
				//上个月有多少天
				let prevMonthDays = moment(currentMoment).subtract(1, 'months').daysInMonth();
				let days = [];
				let oldtime = this.checked.oldtime;
				for (let i = 1, l = monthDays; i <= l; i++) {
					days.push({
						value: i,
						inMonth: true,
						checked: false,
						unavailable: false,
						moment: moment(currentMoment).date(i)
					})
					//Math.ceil(moment(currentMoment).format("D"))获取当前选中是多少号
					//moment(currentMoment, this.format).year() 获取当前选中年份
					//moment(currentMoment, this.format).month() 获取当前选中月份
					if (i == Math.ceil(moment(currentMoment).format("D")) &&
						moment(oldtime, this.format).month() == moment(currentMoment, this.format).month() &&
						moment(oldtime, this.format).year() == moment(currentMoment, this.format).year()
					) {
						days[i - 1].checked = true;
					}
				}
				if (firstDay != 7) {
					for (let i = prevMonthDays, l = prevMonthDays - firstDay + 1; i >= l; i--) {
						days.unshift({
							value: i,
							inMonth: false,
							checked: false,
							unavailable: true,
							action: 'pre',
							moment: moment(currentMoment).subtract(1, 'months').date(i)
						})
					}
				}
				if (days.length < 42) {
					for (let i = 1, l = 42 - days.length; i <= l; i++) {
						days.push({
							value: i,
							inMonth: false,
							checked: false,
							unavailable: true,
							action: 'next',
							moment: moment(currentMoment).add(1, 'months').date(i)
						})
					}
				}
				this.dayList = days;
			},
			checkDay(day) {
				if (day.value == '') return false;
				if (!day.inMonth) {
					this.changeMonth(day.action);
					return;
				}
				this.dayList.map(x => x.checked = false);
				day.checked = true;
				this.selectedDays = day.moment;
			},
			showWhat(type) {
				switch (type) {
					case 'year':
						this.showInfo.year = true
						this.showInfo.month = false
						this.showInfo.day = false
						break;
					case 'month':
						this.showInfo.year = false
						this.showInfo.month = true
						this.showInfo.day = false
						break;
					case 'day':
						this.showInfo.year = false
						this.showInfo.month = false
						this.showInfo.day = true
						break;
					default:
						this.showInfo.year = false
						this.showInfo.month = false
						this.showInfo.day = true
				}
			},
			showMonth() {
				this.showWhat('month');
			},
			showYear() {
				let _year = parseInt(this.checked.year, 10);
				let _years = [];
				for (let i = _year - 100, l = _year + 5; i < l; i++) {
					_years.push(i);
				}

				this.years = _years;
				this.showWhat('year');
				let self = this;
				this.$nextTick(() => {
					let listDom = this.$el.querySelector('#year_list')
					listDom.scrollTop = listDom.scrollHeight - 100;
					self.addYear();
				})
			},
			setMonth(index) {
				index++;
				if (index < 10) {
					index = '0' + '' + index
				}
				let _time = this.checked.year + '-' + index + '-' + this.checked.day;
				this.initDay(_time);
			},
			setYear(year) {
				let _time = year + '-' + this.checked.month + '-' + this.checked.day;
				this.initDay(_time);
			},
			addYear() {
				let self = this;
				let listDom = this.$el.querySelector('#year_list');
				let tmp = 0;
				listDom.addEventListener('scroll', function(e) {
					if (listDom.scrollTop < listDom.scrollHeight - 100) {
						let len = self.years.length;
						let lastYear = self.years[len - 1];
						self.years.push(lastYear + 1)
					}
				}, false)
			}
		},
		created() {
			this.checked.oldtime = this.time;
			this.selectedDays = this.time;
			this.initDay(this.time);
		}
	}

</script>
