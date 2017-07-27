<template>
	<slide-nav class="client-nav">
		<div slot="header">
			<div class="title">
				货运配送
				<calendar-picker class="inline-calendar" :value="nowTime" @calendar-callback="calendarChange"></calendar-picker>
			</div>
			<div class="nav-icon" @click="add()">
			</div>
		</div>
		<div slot="section">
			<ul>
				<router-link :to="{ name: 'info', params: { id: item.id }}" tag="li" v-for="(item,$i) in deliveryOrderList" :key="$i">
					<div class="message">
						<div class="name"><!-- {{item.name}} -->配送单{{$i+1}}</div>
						<div class="operation" v-if="item.editable">
							<span class="icon edit" @click.stop="edit(item)"></span>
							<span class="icon del" @click.stop="del(item,$i)"></span>
						</div>
					</div>
					<div class="details">
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_mileage.png">
							</div>
							<div class="name">配送里程</div>
							<div class="value">{{item.distance}}km</div>
						</div>
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_time.png">
							</div>
							<div class="name">配送时长</div>
							<div class="value">{{item.interval}}</div>
						</div>
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_driver.png">
							</div>
							<div class="name">配送司机</div>
							<div class="value">{{item.driver}}</div>
						</div>
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_quantity.png">
							</div>
							<div class="name">货物数量</div>
							<div class="value">{{item.goods_num}}件</div>
						</div>
					</div>
					<div class="introduce">
						<div class="text mark-order-num">共{{item.total}}单</div>
						<div class="text mark-not-distribution">已配送{{item.delivery}}单</div>
						<div class="text mark-distribution">未配送{{item.no_delivery}}单</div>
					</div>
				</router-link>
			</ul>
		</div>
		<div slot="footer">
			<confirm :title="confirm.del.title" :show="confirm.del.show" :msg="confirm.del.msg" @sure="comfirmDelSure" @cancel="confirmDelCancel"></confirm>
			<loading v-for="(load,$i) in loading" :show="load.show" :key="$i"></loading>
			<ask-toast v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
		</div>
	</slide-nav>
</template>
<script>
import moment from 'moment';
export default {
	data() {
		return {
			deliveryOrderList: [],
			nowTime: '',
			modalTest: false,
			confirm: {
				del: {
					title: '删除操作',
					show: false,
					msg: '',
					item: ''
				}
			},
			loading: {
				init: {
					show: false
				},
				del:{
					show: false
				}
			},
			askToast: []
		}
	},
	created() {
		this.nowTime = moment().format("YYYY-MM-DD");
		let _time  = Date.now();
		let _timeVal  = (new Date(this.nowTime+' 16:00')).getTime();
		if(_time  > _timeVal){
			this.nowTime = moment().add(1,'day').format("YYYY-MM-DD");
		}
		this.initList(this.nowTime);
		this.$emit('time-change',this.nowTime);
	},
	methods: {
		add(){
			this.$router.push({ name: 'operation', params: { type: 'add'}});
		},
		edit(item) {
			this.$router.push({ name: 'operation', params: { type: 'edit'} , query:{id:item.id}});
		},
		del(item,index) {
			this.confirm.del.show = true;
			this.confirm.del.msg = `确定删除配送单${index+1}的信息？`;
			this.confirm.del.item = item;
		},
		comfirmDelSure() {
			this.delList(this.confirm.del.item);
		},
		confirmDelCancel() {
			this.confirm.del.show = false;
		},
		calendarChange(time) {
			this.nowTime = time;
			this.initList(time);
			this.$emit('time-change',time);
		},
		initList(time) {
			let self = this;
			//配送单数据
			self.$http.get(
				self.$api.client_delivery_order,
				{
					platform_id: self.$platformId,
					date: time
				},
				{
				before: response => {
					//弹框遮罩层
					self.loading.init.show = true;
				}
			}).then(response => {
				self.loading.init.show = false;
				if(response.data.code != 1000){
				    self.toastShow(response.data.message ? response.data.message:'接口访问异常！');
				    return;
				}
				self.deliveryOrderList = response.data.result;
			}, response => {
				self.loading.init.show= false;
				self.toastShow(response.data.message ? response.data.message:'接口访问失败！');
			})
		},
		delList(item) {
			let self = this;
			//配送单数据
			self.$http.post(
				self.$api.client_delivery_order_del,
				{
					platform_id: self.$platformId,
					id: item.id
				},
				{
					before: response => {
						//弹框遮罩层
						self.loading.del.show = true;
					}
				}
			).then(response => {
				self.loading.del.show = false;
				if(response.data.code != 1000){
				    self.toastShow(response.data.message ? response.data.message:'接口访问异常！');
				    return;
				}
				self.toastShow(response.data.message ? response.data.message:'删除成功！');
				self.confirm.del.show = false;
				self.deliveryOrderList = self.deliveryOrderList.filter(index => index.id != item.id);

			}, response => {
				self.loading.del.show = false;
				self.toastShow(response.data.message ? response.data.message:'接口访问失败！');
			})
		},
		toastShow(text) {
			this.askToast.push({
				msg: text
			})
			setTimeout(() => this.askToast.splice(0, 1), 2000);
		}
	}
}
</script>
