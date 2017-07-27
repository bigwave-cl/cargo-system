<template>
    <div class="cgm-home cgm-client">
        <client-nav @time-change="orderInit"></client-nav>
        <div class="map-tag">
            <ul class="map-count">
                <li>
                    <div class="text">
                        <span class="num mark-order-num">{{order.total}}</span>
                        <span>订单数量</span>
                    </div>
                </li>
                <li>
                    <div class="text">
                        <span class="num mark-not-distribution">{{order.no_delivery}}</span>
                        <span>未配送</span>
                    </div>
                </li>
                <li>
                    <div class="text">
                        <span class="num mark-distribution">{{order.delivery}}</span>
                        <span>已配送</span>
                    </div>
                </li>
            </ul>
            <div class="map-order-select">
                <div class="select-tile" :class="{active: orderOptionShow}" @click="orderOption">
                    全部订单
                </div>
                <transition name="client-select">
                    <div class="select-option" v-show="orderOptionShow">
                        <div class="cur">
                            <input type="checkbox" id="order_option_all" v-model="orderOptionCheackAll">
                            <label for="order_option_all" @click="filterOrder('all')">
                                <span class="text">全部订单</span>
                                <span class="icon"></span>
                            </label>
                        </div>
                        <div class="cur" v-for="(order,index) in orderList" :key="index">
                            <input type="checkbox" name="" v-model="order.ischecked" :id="'order_option_'+index">
                            <label :for="'order_option_'+index" @click="filterOrder('one')">
                                <span class="text">{{order.name}}的订单</span>
                                <span class="icon"></span>
                            </label>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div id="map_client" class="map-container"></div>
        <loading slot="footer" v-for="(load,$i) in loading" :show="load.show" :key="$i"></loading>
        <ask-toast slot="footer" v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
    </div>
</template>
<script>
import {
    mapLoad
} from '@/components/map/map';
import clientNav from './client-nav.vue';
export default {
    name: 'clinet',
    data() {
        return {
            map: '',
            orderOptionShow: false,
            orderOptionCheackAll: true,
            markers: [],
            orderList: [],
            order: {
                total: 0,
                no_delivery: 0,
                delivery: 0
            },
            askToast: [],
            initCount: 0,
            loading: {
                order: { show: false }
            }
        }
    },
    created() {
        let self = this;
    },
    mounted() {
        let self = this;
        //地图初始化
        mapLoad(self.$mapKey).then(AMap => {
            self.map = new AMap.Map('map_client', {
                center: self.$mapCenter,
                zoom: 18,
                zooms: [10, 18]
            })
        }, error => {
            console.log(error);
        })
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
        mapMarkerInit() {
            let self = this;
            for (let order_cur of self.orderList) {
                if (order_cur.ischecked) {
                    for (let tag of order_cur.items) {
                        //state == 1 已配送  state== 2 未配送
                        let tagIcon = tag.state === 1 ? 'distribution' : 'not-distribution';
                        let content = `<div class="map-point-box">
                                            <div class="map-point-main">
                                                <div class="details">
                                                    <div class="text client">${tag.name}</div>
                                                    <div class="text client">送货数量:${tag.cargo_num}</div>
                                                    <div class="text client mark-small">${tag.remarks}</div>
                                                </div>
                                            </div>
                                            <div class="map-point ${tagIcon}">
                                            </div>
                                        </div>`;
                        let marker = new AMap.Marker({
                            position: [tag.location.longitude, tag.location.latitude],
                            content: content,
                            offset: new AMap.Pixel(-114, -140),
                            map: self.map
                        });
                        marker.on('click', self.markerClick);
                        self.markers.push(marker);
                    }
                }
            }
            self.map.setFitView();
        },
        orderInit(time) {
            let self = this;
            //订单数据
            self.$http.get(
                self.$api.client_order, {
                    platform_id: self.$platformId,
                    date: time
                }, {
                    before: response => {
                        //弹框遮罩层
                        self.loading.order.show = true;
                    }
                }
            ).then(response => {
                self.loading.order.show = false;
                if (response.data.code != 1000) {
                    self.toastShow(response.data.message ? response.data.message : '接口访问异常！');
                    return;
                }
                if (response.data.result.list.length == 0) {
                    self.toastShow('暂无数据');
                    self.orderList = [];

                    self.order = {
                        total: 0,
                        no_delivery: 0,
                        delivery: 0
                    }
                } else {
                    self.orderList = response.data.result.list.map(function(index, elem) {
                        index.ischecked = true;
                        return index;
                    });
                    self.order = {
                        total: response.data.result.total,
                        no_delivery: response.data.result.no_delivery,
                        delivery: response.data.result.delivery
                    }

                    if (self.map) {
                        self.map.remove(self.markers);
                    }
                }
            }, response => {
                self.loading.order.show = false;
                self.toastShow(response.data.message ? response.data.message : '接口访问失败！');
            });
        },
        filterOrder(type) {
            let self = this;
            let timer = setTimeout(() => {
                if (type === 'all') {
                    for (let cur of self.orderList) {
                        cur.ischecked = self.orderOptionCheackAll;
                    }
                    self.map.remove(self.markers);
                    self.mapMarkerInit();
                }
                if (type === 'one') {
                    let noMore = false;
                    for (let cur of self.orderList) {
                        if (!cur.ischecked) noMore = true;
                    }
                    if (noMore) self.orderOptionCheackAll = false;
                    else self.orderOptionCheackAll = true;

                    self.map.remove(self.markers);
                    self.mapMarkerInit();
                }
                clearTimeout(timer);
            }, 0);
        },
        orderOption() {
            let self = this;
            self.orderOptionShow = !self.orderOptionShow;
        },
        markerClick(e) {
            $(e.target.getContentDom())
                .closest('.amap-marker')
                .siblings('.amap-marker')
                .css({
                    'z-index': '' + e.target.getzIndex()
                });
            e.target.setzIndex('' + e.target.getzIndex() + 5);
        }
    },
    watch: {
        'map': function(n, o) {
            let self = this;

            if (self.orderList.length > 0 && self.initCount === 0) {
                self.initCount = 1;
                self.mapMarkerInit();
            }
        },
        'orderList': function(n, o) {
            let self = this;

            if (self.map != '') {
                self.initCount = 1;

                self.map.remove(self.markers);
                self.mapMarkerInit();
                self.filterOrder('one');
            }
        }
    },
    components: {
        'client-nav': clientNav
    }
}

</script>
