<template>
	<div class="driver-seleced">
		<div class="dirver-label" @click="showBox">
			<slot name="label"></slot>
		</div>
		<modal  :show="show" 
				:overlay="overlay" 
				:overlayOpacity="overlayOpacity" 
				:overlayColor="overlayColor" 
				:hideClose="hideClose" 
				:title="title" 
				:closeIcon = "closeIcon"
				@modal-cancel="hideBox" 
				v-if="show"
				class="driver-modal">
			<div class="driver-seleced-box">
				<ul>
					<li class="item" v-for="(dr,$i) in driverList.item" :key="$i">
						<div class="group">
							<div class="text">
								<span>姓名：{{dr.driver}}</span>
								<span class="tag" v-if="dr.tag">{{dr.tag}}</span>
							</div>
							<div class="input-radio driver-pos">
								<input type="radio" name="driver" value="" :id="'driver_radio_'+$i" :checked="dr.id == driverList.selectId">
								<label :for="'driver_radio_'+$i" @click="setChecked(dr)"></label>
							</div>
						</div>
						<div class="group">
							<h3>车辆信息</h3>
							<div class="list">
								<div class="one" v-if="dr.car_info.length" v-for="(car,$car_i) in dr.car_info" :key="$car_i">
									<div class="name">{{car.name}}:</div>
									<div class="value">{{car.value}}</div>
								</div>
							</div>
						</div>
						<div class="group">
							<h3>载货信息</h3>
							<div class="list">
								<div class="one" v-if="dr.goods_info.length" v-for="(goods,$goods_i) in dr.goods_info" :key="$goods_i">
									<div class="name">{{goods.name}}:</div>
									<div class="value">{{goods.value}}</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</modal>
		<ask-toast v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
	</div>
</template>
<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		overlay: {
			type: Boolean,
			default: true
		},
		overlayOpacity: {
			type: Number,
			default: 0.4
		},
		overlayColor: {
			type: String,
			default: '#000'
		},
		hideClose: {
			type: Boolean,
			default: true
		},
		closeIcon: {
			type: Boolean,
			default: false
		},
		driverList: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			show: false,
			askToast: []
		}
	},
	methods: {
		showBox() {
			this.show = true;
		},
		hideBox() {
			this.show = false;
		},
		setChecked(item){
			this.driverList.selectId = item.id;
			this.driverList.driver = item.driver;
		}
	},
	watch:{
		'driverList':{
            handler: function(n, o) {
            	// this.driverList.selectId = n.selectId;
            	// this.driverList.driver = n.driver;
            	// this.driverList.item = n.item;
            },
            deep: true
        }
	}
}

</script>
