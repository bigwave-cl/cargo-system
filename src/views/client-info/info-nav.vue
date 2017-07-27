<template>
	<slide-nav class="info-nav">
		<div slot="header" class="back-icon" @click="back()">
		</div>
		<div slot="header" class="title" @click="back()">
			<span><!-- {{detail.name}} -->配送单详情</span>
			<div class="time">
				{{detail.order_time}}
			</div>
		</div>
		<div slot="section">
			<ul class="m-list">
				<li class="list-li">
					<div class="message">
						<div class="name">配送里程与时长估算</div>
					</div>
					<div class="details">
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_mileage.png">
							</div>
							<div class="name">配送里程</div>
							<div class="value">{{detail.distance}}km</div>
						</div>
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_time.png">
							</div>
							<div class="name">配送时长</div>
							<div class="value">{{detail.interval}}</div>
						</div>
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_quantity.png">
							</div>
							<div class="name">送货总量</div>
							<div class="value">{{detail.goods_num}}件</div>
						</div>
					</div>
				</li>
				<li class="list-li">
					<div class="details driver">
						<div class="one">
							<div class="icon">
								<img src="../../assets/icon_driver.png">
							</div>
							<div class="name">配送司机</div>
							<div class="value">{{detail.driver}}</div>
						</div>
					</div>
				</li>
				<li class="info-order-title">
					配送订单
				</li>
				<li class="list-li order-li" v-for="(o,$i) in detail.items" :key="$i">
					<div class="info-li-box">
						<div class="message">
							<div class="name">{{o.name}}</div>
						</div>
						<div class="details">
							<div class="one">
								<div class="name">配送顺序</div>
								<div class="value">{{$i+1}}</div>
							</div>
							<div class="one">
								<div class="name">送货数量</div>
								<div class="value">{{o.cargo_num}}</div>
							</div>
							<div class="one">
								<div class="name">指定配送时间</div>
								<div class="value">{{o.delivery_time}}</div>
							</div>
							<div class="one">
								<div class="name remarkes">备注:{{o.remarks}}</div>
							</div>
						</div>
					</div>
					<div class="info-li-box time">
						<div class="details">
							<div class="one">
								<div class="name">到达时间:
									<span v-text="o.state == 1 ? o.already.arrival:'--'"></span>
								</div>
								<div class="value" :class="[{'delivery':o.state == 1},{'undelivery':o.state == 2}]" 
													v-text="o.state == 1 ? '已配送':'未配送'">
								</div>
							</div>
							<div class="one">
								<div class="name">离开时间:
									<span v-text="o.state == 1 ? o.already.departure:'--'"></span>
								</div>
								<div class="value">
									停留<span v-text="o.state == 1 ? o.already.stop:'0分钟'"></span>
								</div>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</slide-nav>
</template>
<script>
import moment from 'moment';
export default {
	props: {
		detail: {
			type: [Array, Object],
			default: []
		}
	},
	methods: {
		back() {
			window.history.back();
		}
	}
}

</script>
