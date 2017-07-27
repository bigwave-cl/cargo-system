<template>
    <div class="cgm-home cgm-client">
        <info-nav :detail="details"></info-nav>
        <div class="map-tag">
            <ul class="map-count">
                <li>
                    <div class="text">
                        <span class="num mark-order-num">{{details.total}}</span>
                        <span>订单数量</span>
                    </div>
                </li>
                <li>
                    <div class="text">
                        <span class="num mark-not-distribution">{{details.no_delivery}}</span>
                        <span>未配送</span>
                    </div>
                </li>
                <li>
                    <div class="text">
                        <span class="num mark-distribution">{{details.delivery}}</span>
                        <span>已配送</span>
                    </div>
                </li>
            </ul>
        </div>
        <div id="map_client" class="map-container"></div>
        <loading v-for="(load,$i) in loading" :show="load.show" :key="$i"></loading>
        <ask-toast slot="footer" v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
    </div>
</template>
<script>
import {
    mapLoad
} from '@/components/map/map';
import infoNav from './info-nav.vue';
export default {
    name: 'clinet',
    data() {
        return {
            map: '',
            markers: [],
            details: [],
            askToast: [],
            loading: {
                detail: { show: false }
            }
        }
    },
    mounted() {
        let self = this;

        //详情数据
        self.$http.get(
            self.$api.client_delivery_order_detail, {
                platform_id: self.$platformId,
                id: self.$route.params.id
            }, {
                before: response => {
                    //弹框遮罩层
                    self.loading.detail.show = true;
                }
            }
        ).then(response => {
            self.loading.detail.show = false;
            if (response.data.code != 1000) {
                self.toastShow(response.data.message ? response.data.message : '接口访问异常！');
                return;
            }
            self.details = response.data.result;
        }, response => {
            self.loading.detail.show = false;
            self.toastShow(response.data.message ? response.data.message : '接口访问失败！');
        });


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
            let driver_opt = [];
            driver_opt.push(self.$mapCenter);

            //根据后台polylines点描绘行驶路径
            if(self.details.polylines && self.details.polylines.length > 0){
                let lineArr = self.details.polylines.map(index => {
                    return [index.longitude, index.latitude];
                })
                let polyline = new AMap.Polyline({
                    path: lineArr, // 设置线覆盖物路径
                    isOutline: true, //是否描边
                    outlineColor: '#000', //设置描边颜色，当outlineColor为true时有效
                    strokeColor: '#f16622', // 线颜色
                    strokeOpacity: 1, // 线透明度
                    strokeWeight: 8, // 线宽
                    strokeStyle: 'solid', // 线样式
                    strokeDasharray: [10, 5], // 补充线样式
                    geodesic: true, // 绘制大地线
                    lineJoin: 'round', //转角样式
                    showDir: true //是否延路径显示白色方向箭头
                });
                polyline.setMap(self.map);

            }
            for (let cur of self.details.items) {
                //state == 1 已配送  state== 2 未配送
                let tagIcon = cur.state === 1 ? 'distribution' : 'not-distribution';
                let arrival_time = cur.state === 1 ? cur.already.arrival : '--',
                    departure_time = cur.state === 1 ? cur.already.departure : '--',
                    residence = cur.state === 1 ? cur.already.stop : '0分钟';
                let content = `<div class="map-point-box info">
                                            <div class="map-point-main info">
                                                <div class="details">
                                                    <div class="text client">${cur.name}</div>
                                                    <div class="text time">到达时间:<i>${arrival_time}</i></div>
                                                    <div class="text time">离开时间:<i>${departure_time}</i></div>
                                                </div>
                                                <div class="time-box">
                                                    <div class="text mark-special">${residence}</div>
                                                    <div class="text mark-special">停留时间</div>
                                                </div>
                                            </div>
                                            <div class="map-point ${tagIcon}">
                                            </div>
                                        </div>`;
                let marker = new AMap.Marker({
                    position: [cur.location.longitude, cur.location.latitude],
                    content: content,
                    offset: new AMap.Pixel(-114, -140),
                    map: self.map
                });
                marker.on('click', self.markerClick);
                self.markers.push(marker);
                //构造路线导航类
                if (cur.state == 1) {
                    driver_opt.push([cur.location.longitude, cur.location.latitude]);
                }
            }
            AMap.service('AMap.Driving', function() { //回调函数
                //实例化Driving
                let driving = new AMap.Driving({
                    map: self.map,
                    policy: AMap.DrivingPolicy.LEAST_DISTANCE
                });
                if (driver_opt.length <= 1) return;
                let len = driver_opt.length;
                let waypoints = driver_opt.filter((key, index) => index != 0 && index != (len - 1));

                driving.search(driver_opt[0], driver_opt[len - 1], { waypoints: waypoints });
            });
            self.map.setFitView();
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
            if (self.details != '') self.mapMarkerInit();
        },
        'details': function(n, o) {
            let self = this;
            if (self.map != '') self.mapMarkerInit();
        }
    },
    components: {
        'info-nav': infoNav
    }
}

</script>
