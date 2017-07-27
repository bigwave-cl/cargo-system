<template>
	<transition name="sub-menu-slide">
	<slide-nav class="operation-sub-menu" v-if="show" :toggle-btn="false">
		<div slot="header" class="back-icon" @click="toogleShow()">
		</div>
		<div slot="header" class="title" @click="toogleShow()">
			<span>订单列表</span>
		</div>
		<div slot="section">
			<ul class="m-list">
				<li v-for="(order,$i) in orderList" :key="$i" v-if="order.ischecked">
					<ul>
						<li class="list-li order-li" v-for="(item,$it) in order.items" :key="$it">
							<div class="order-li-box">
								<div class="message">
									<div class="name">{{item.name}}</div>
									<div class="operation">
										<div class="input-checkbox">
										<input type="checkbox" value="" :id="'order_checkbox_'+$i+'_'+$it" v-model="item.ischecked"><!-- v-bind="{'checked':item.ischecked}" -->
										<label :for="'order_checkbox_'+$i+'_'+$it" @click="setChecked($i,$it,item)"></label>
										<div class="check-overlay" @click="setChecked($i,$it,item)"></div>
									</div>
									</div>
								</div>
								<div class="details">
									<div class="one">
										<div class="name">配送数量</div>
										<div class="value">{{item.cargo_num}}</div>
									</div>
									<div class="one">
										<div class="name">指定配送时间</div>
										<div class="value">{{item.delivery_time}}</div>
									</div>
									<div class="one">
										<div class="name remarkes">备注:{{item.remarks}}</div>
									</div>
									<div class="one distance">
										<div class="name remarkes">
											<span>{{item.distance}}</span>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
        <loading v-for="(load,$i) in loading" :show="load.show" :key="$i"></loading>
		<ask-toast slot="footer" v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
	</slide-nav>
	</transition>
</template>
<script>
export default {
	props: {
		show:{
			type:Boolean,
			default:false
		},
		choseList: {
			type: Array,
			default: []
		},
		orderList: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			loading:{
				driver:{
					show:false
				}
			},
			askToast: []
		}
	},
	methods: {
		toogleShow(){
			this.$emit('toggle-click');
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
		},
		setChecked(userIndex,index,item){
			let self = this;
			let timer = setTimeout(() => {
				if(self.orderList[userIndex].items[index].ischecked){
					this.$emit('order-change','add',item);
				}else{
					this.$emit('order-change','redu',item);
				}
			    clearTimeout(timer);
			}, 0);
			
		}
	}
}

</script>
