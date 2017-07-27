<template>
	<slide-nav class="operation-nav" :button-class="subMenuShow ? 'active' : ''" :toggle-click="subMenuHide">
		<div slot="header" class="back-icon" @click="back()">
		</div>
		<div slot="header" class="title" @click="back()">
			<span v-if="type == 'edit'">配送单编辑</span>
			<span v-if="type == 'add'">配送单新增</span>
		</div>
		<div slot="header" class="sub-menu" @click.stop="toggleSubMenu()" :class="{'active':subMenuShow}">
			<div class="icon-menu">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
		<div slot="section">
			<ul class="m-list">
				<li class="list-li">
					<div class="message counter">
						<div class="name">配送里程与时长估算</div>
						<div class="operation">
							<span class="icon counter" @click.stop="distributionEstimation()"></span>
						</div>
					</div>
					<div class="details">
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_mileage.png">
							</div>
							<div class="name">配送里程</div>
							<div class="value">{{estimateRoutes.distance}}</div>
						</div>
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_time.png">
							</div>
							<div class="name">配送时长</div>
							<div class="value">{{estimateRoutes.time.conversion}}</div>
						</div>
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_quantity.png">
							</div>
							<div class="name">送货总量</div>
							<div class="value">{{estimateRoutes.number}}</div>
						</div>
					</div>
				</li>
				<li class="list-li">
					<driver-list :driver-list="driverList" :title="'选择配送司机'">
						<div class="details driver" slot="label">
							<div class="one">
								<div class="icon">
									<img src="../../assets/icon_driver.png">
								</div>
								<div class="name" v-text="driverList.driver ? driverList.driver:'选择司机'"></div>
								<div class="value"></div>
							</div>
						</div>
					</driver-list>
				</li>
				<li class="order-title">
					配送订单
				</li>
				<transition-group name="delivery-order-slide" tag="ul">
					<li class="list-li order-li" v-for="(c,$i) in choseList" :key="$i">
						<div class="order-li-box">
							<div class="message">
								<div class="name">{{c.name}}</div>
							</div>
							<div class="details">
								<div class="one">
									<div class="name">配送顺序</div>
									<div class="value">
										<ask-prompt :title="'修改排序位置(最小值:1,最大值:'+choseList.length+')'" :type="'number'" :value="($i+1)" :minLength="1" :maxLength="choseList.length" @callback="changeSort"></ask-prompt>
									</div>
								</div>
								<div class="one">
									<div class="name">送货数量</div>
									<div class="value">{{c.cargo_num}}</div>
								</div>
								<div class="one">
									<div class="name">指定配送时间</div>
									<div class="value">
										<time-picker :time="c.delivery_time" @callback="timeSelect" v-bind:data-id="c.order_id"></time-picker>
									</div>
								</div>
								<div class="one">
									<div class="name remarkes">备注:{{c.remarks}}</div>
								</div>
							</div>
						</div>
						<div class="order-li-box operation">
							<div class="message">
								<div class="operation">
									<span v-if="$i != (choseList.length-1)" class="icon move" @click.stop="moveDown(c,$i)"></span>
									<span v-if="$i != 0" class="icon move-up" @click.stop="moveUp(c,$i)"></span>
									<span class="icon del" @click.stop="del(c)"></span>
								</div>
							</div>
						</div>
					</li>
				</transition-group>
			</ul>
		</div>
		<div slot="footer" class="operation-fixed-button">
			<ask-button :text="'确定'" @ask-click="save()"></ask-button>
		</div>
        <loading v-for="(load,$i) in loading" :show="load.show" :key="$i"></loading>
		<ask-toast slot="footer" v-for="(toast,$i) in askToast" :msg="toast.msg" :key="$i"></ask-toast>
		<sub-menu   slot="footer"
				    :show="subMenuShow" 
				    @toggle-click="toggleSubMenu" 
				    :order-list="orderList" 
				    :chose-list="choseList"
				    @order-change="orderChange">
		</sub-menu>
	</slide-nav>
</template>
<script>
import {
	mapLoad
} from '@/components/map/map';
import moment from 'moment';
import driverList from './driver-list';
import operationSubMenu from './operation-sub-menu';
export default {
	props: {
		id:{
			type:[String,Number],
			default:''
		},
		type: {
			type: String,
			default: ''
		},
		choseList: {
			type: Array,
			default: []
		},
		orderList: {
			type: Array,
			default: []
		},
		driverList: {
			type: Object,
			default:{
				selectId: '',
				driver: "",
				item: []
			}
		}
	},
	data() {
		return {
			loading: {
				driver: {
					show: false
				},
				save:{
					show:false
				}
			},
			askToast: [],
			countComplete:0,
			postChoseList:[],
			estimateRoutes: {
				time: {
					second:0,
					conversion:'0分'
				},
				distance: '0km',
				number: '0件'
			},
			subMenuShow: false
		}
	},
	created() {
		let self = this;
		self.$http.get(
			self.$api.client_driver,
			{
				platform_id: self.$platformId,
			},
			{
				before: response => {
					//弹框遮罩层
					self.loading.driver.show = true;
				}
			}
		).then(response => {
			self.loading.driver.show = false;
			if (response.data.code != 1000) {
			    self.toastShow(response.data.message ? response.data.message : '接口访问异常！');
			    return;
			}
			self.driverList.item = response.data.result.map(index => {
				index.checked = false;
				return index;
			});
		}, response => {
			self.loading.driver.show = false;
            self.toastShow(response.data.message ? response.data.message : '接口访问失败！');
		})
	},
	computed: {
		currentTime() {
			return moment().format('YYYY-MM-DD');
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
		back() {
			window.history.back();
		},
		del(item) {
			this.$emit('item-del', item);
		},
		moveDown(item, index) {
			this.$emit('down', item, index);
		},
		moveUp(item, index) {
			this.$emit('up', item, index);
		},
		timeSelect(el, time) {
			let orderId = el.getAttribute('data-id');
			for (let i = 0, l = this.choseList.length; i < l; i++) {
				if (this.choseList[i].order_id == orderId) {
					this.choseList[i].delivery_time = time;
					return;
				}
			}
		},
		changeSort(n, o) {
			let _newIndex = parseInt(n, 10),
				_oldIndex = parseInt(o, 10);
			if (_newIndex - _oldIndex === 0) return;
			if (_newIndex - _oldIndex > 0) {
				//向下移
				this.$emit('go', this.choseList[_oldIndex - 1], _oldIndex - 1, _newIndex - _oldIndex, 'down');
			}
			if (_newIndex - _oldIndex < 0) {
				//向上移
				this.$emit('go', this.choseList[_oldIndex - 1], _oldIndex - 1, _oldIndex - _newIndex, 'up');
			}

		},
		distributionEstimation() {
			let self = this;
			if (self.choseList.length < 1) {
				self.toastShow('请先选择配送订单',()=>{
					self.estimateRoutes.distance = '0km';
					self.estimateRoutes.time = {
						second:0,
						conversion:'0分'
					};
					self.estimateRoutes.number = '0件';
				});
				return;
			}
			let driver_opt = [],
				driver_num = 0;
			driver_opt.push(self.$mapCenter)
			self.choseList.map(index => {
				driver_opt.push([index.location.longitude, index.location.latitude]);
				driver_num += parseInt(index.cargo_num, 10);
			})
			AMap.service('AMap.Driving', function() { //回调函数
				//实例化Driving
				let driving = new AMap.Driving({
					policy: AMap.DrivingPolicy.LEAST_DISTANCE
				});
				if(driver_opt.length <= 1) return;
				let len = driver_opt.length;
				let waypoints = driver_opt.filter((key, index) => index != 0 && index != (len - 1));
				driving.search(driver_opt[0], driver_opt[len - 1], { waypoints: waypoints }, (status, result) => {
					if (status == 'complete') {
						self.estimateRoutes.distance = result.routes[0].distance / 1000 + 'km';
						self.estimateRoutes.time = {
							second:result.routes[0].time,
							conversion:self.timeConversion(result.routes[0].time)
						};
						self.estimateRoutes.number = driver_num + '件';
					}
					if (status == 'error') {
						self.toastShow('传入信息有误');
					}
					if (status == 'no_data') {
						self.toastShow('无结果返回');
					}
				});
			});
		},
		timeConversion(time) {
			let _t = '';
			if (time && time > -1) {
				let hour = Math.floor(time / 3600),
					minute = Math.floor(time / 60) % 60,
					second = time % 60;
				_t = hour > 0 ? hour + '时' : '';
				_t += (minute > 0 || (hour > 0 && second > 0)) ? minute + '分' : '';
				_t += second > 0 ? second + '秒' : '';
				return _t;
			}
		},
		subMenuHide() {
			this.subMenuShow = false;
		},
		toggleSubMenu() {
			this.subMenuShow = !this.subMenuShow;
		},
		orderChange(type,item){
			this.$emit('item-change',type,item);
		},
		save() {
			let self = this;

			//TODO 计算两点之间的距离并保存
			if(self.choseList.length === 0){
				self.toastShow('请先选择配送订单');
				return;
			}
			if(self.driverList.selectId == ''){
				self.toastShow('请选择配送司机');
				return;
			}

			AMap.service('AMap.Driving', function() { //回调函数
				//实例化Driving
				let driving = new AMap.Driving({
					policy: AMap.DrivingPolicy.LEAST_DISTANCE
				});
				self.postChoseList = self.choseList.map((key,index)=>{
					if(index == 0){
						driving.search(self.$mapCenter, [key.location.longitude, key.location.latitude], (status, result) => {
							
							if (status == 'complete') {
								key.distance = result.routes[0].distance;
								key.interval = result.routes[0].time;
								self.countComplete = self.countComplete + 1;
							}
							if (status == 'error') {
								self.toastShow('传入信息有误');
							}
							if (status == 'no_data') {
								self.toastShow('无结果返回');
							}
						});
					}else{
						let cur = self.choseList[index-1];
						driving.search([cur.location.longitude, cur.location.latitude],[key.location.longitude, key.location.latitude], (status, result) => {

							if (status == 'complete') {
								key.distance = result.routes[0].distance;
								key.interval = result.routes[0].time;
								self.countComplete = self.countComplete + 1;
							}
							if (status == 'error') {
								self.toastShow('传入信息有误');
							}
							if (status == 'no_data') {
								self.toastShow('无结果返回');
							}
						});
					}
					return key;
				});
			});
		}
	},
	components: {
		'driver-list': driverList,
		'sub-menu': operationSubMenu
	},
	watch:{
		'countComplete':function(n,o){
			let self = this;

			if(n == self.choseList.length){
				
				self.countComplete = 0;
				self.distributionEstimation();
				let postItems = [],postAllDistance=0,postAllTime=0;
				for(let c of self.postChoseList){
					 c.distance = parseInt(c.distance,10);
					 c.interval = parseInt(c.interval,10);
					let postItem = {
			            "order_id": c.order_id,
			            "delivery_time": c.delivery_time,
			            "distance": c.distance/1000,
			            "interval": c.interval
					}
					postAllDistance+=c.distance;
					postAllTime+=c.interval;
					postItems.push(postItem);
				}

				let postData = {
				    "platform_id": self.$platformId,
				    "name": "配送单名字",
				    "distance": postAllDistance/1000,
				    "interval": postAllTime,
				    "driver_id": self.driverList.selectId,
				    "items": postItems
				};

				if(self.type === 'add'){
					postData.act = 'add';
				}

				if(self.type === 'edit'){
					postData.act = 'edit';
					postData.id =  self.id;
				}

				self.$http.get(
				    self.$api.client_save, 
				    postData, {
				        before: response => {
				            //弹框遮罩层
				            self.loading.save.show = true;
				        }
				    }
				).then(response => {
				    self.loading.save.show = false;
				    if (response.data.code != 1000) {
				        self.toastShow(response.data.message ? response.data.message : '接口访问异常！');
				        return;
				    }
				    self.toastShow(response.data.message ? response.data.message:'保存成功!',()=>{
						self.$router.push({ name: 'client-dis'});
				    });
				}, response => {
				    self.loading.save.show = false;
				    self.toastShow(response.data.message ? response.data.message : '接口访问失败！');
				});
			}
		}
	}
}

</script>
