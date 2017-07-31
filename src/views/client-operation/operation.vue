<template>
    <div class="cgm-home cgm-client cgm-operation">
        <operation-nav 
                        :type="operationType" 
                        :id="operationID"
                        :choseList="choseList" 
                        :orderList="orderList" 
                        :driverList="editDriver" 
                        @item-del="choseRemove" 
                        @up="choseMoveUp" 
                        @down="choseMoveDown" 
                        @go="choseMoveGo" 
                        @item-change="choseChange">
        </operation-nav>
        <div class="map-tag">
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
        <div id="map_client" class="map-container" @click="mapMarkerInputClick($event)"></div>
        <loading v-for="(load,$i) in loading" :show="load.show" :key="$i"></loading>
        <ask-toast slot="footer" v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
    </div>
</template>
<script>
import {
    mapLoad
} from '@/components/map/map';
import operationNav from './operation-nav';
export default {
    name: 'clinet',
    data() {
        return {
            map: '',
            initCount: 0,
            orderOptionShow: false,
            orderOptionCheackAll: true,
            markers: [],
            orderList: [],
            choseList: [],
            operationType: '',
            operationID: '',
            askToast: [],
            loading: {
                order: { show: false },
                edit: { show: false }
            },
            editDriver:{
                selectId:'',
                driver:'',
                item:[]
            }
        }
    },
    created() {
        let self = this;
        self.operationType = self.$route.params.type;
        if (self.operationType === 'edit') {
            self.operationID = self.$route.query.id;
            // self.$http.get(
            //     self.$api.client_edit, {
            //         platform_id: self.$platformId,
            //         id:self.operationID
            //     }, {
            //         before: response => {
            //             //弹框遮罩层
            //             self.loading.edit.show = true;
            //         }
            //     }
            // ).then(response => {
            //     self.loading.edit.show = false;
            //     if (response.data.code != 1000) {
            //         self.toastShow(response.data.message ? response.data.message : '接口访问异常！');
            //         return;
            //     }
            //     self.editDriver.selectId = response.data.result.driver_id;
            //     self.editDriver.driver = response.data.result.driver;
            //     self.choseList = response.data.result.items;
            // }, response => {
            //     self.loading.edit.show = false;
            //     self.toastShow(response.data.message ? response.data.message : '接口访问失败！');
            // });
            self.editDriver.selectId = 1;
            self.editDriver.driver = '王建来';
            self.choseList = [{"order_id":2,"name":"红旗连锁","address":"四川省成都市高新区天府大道天府二街138号","state":1,"delivery_time":"13:32-14:32","cargo_num":30,"remarks":"","location":{"longitude":104.066704,"latitude":30.5516},"ischecked":true,"distance":12636,"sort":3,"interval":2020},{"order_id":8,"name":"好又多","address":"四川省成都市天府新区维也纳森林公园","state":2,"delivery_time":"13:34","cargo_num":30,"remarks":"","location":{"longitude":104.2,"latitude":30.501692},"ischecked":true,"distance":17255,"sort":5,"interval":2761},{"order_id":6,"name":"OMGSSSS","address":"四川省成都市锦江区妇幼","state":2,"delivery_time":"13:32~15:36","cargo_num":30,"remarks":"","location":{"longitude":104.080986,"latitude":30.657688},"ischecked":true,"distance":25631,"sort":7,"interval":4223}];
        }
    },
    mounted() {
        let self = this;
        //订单数据
        let postData = {
            platform_id: self.$platformId
        }
        if(self.operationType === 'edit'){
            postData.id = self.operationID;
        }
        self.$http.get(
            self.operationType === 'edit' ? self.$api.client_edit_order : self.$api.client_add_order, 
            postData, {
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
            self.orderList = response.data.result.map(function(index, elem) {
                index.ischecked = true;
                return index;
            });
        }, response => {
            self.loading.order.show = false;
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
            let order_index = 0;
            for (let order_cur of self.orderList) {
                if (order_cur.ischecked) {
                    for (let tag of order_cur.items) {
                        order_index++;

                        let tagIcon = 'not-distribution';
                        let tagSelect = '',
                            tagChecked = false;
                        if (self.choseList.length != 0) {
                            tagChecked = self.choseList.filter(index => index.order_id == tag.order_id).length == 1 ? true : false;
                        }
                        tag.ischecked = tagChecked;
                        tagSelect = tagChecked ? 'checked' : '';

                        let content = `<div class="map-point-box info">
                                            <div class="map-point-main info">
                                                <div class="details">
                                                    <div class="text client">${tag.name}</div>
                                                    <div class="text client">送货数量:${tag.cargo_num}</div>
                                                    <div class="text client mark-small">${tag.remarks}</div>
                                                </div>
                                                <div class="time-box operation">
                                                    <input type="checkbox" ${tagSelect} class="circle" id="marker_check_${order_index}" data-id="${tag.order_id}" >
                                                    <label for="marker_check_${order_index}"></label>
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
            let self = this;
            $(e.target.getContentDom())
                .closest('.amap-marker')
                .siblings('.amap-marker')
                .css({
                    'z-index': e.target.getzIndex()
                });
            e.target.setzIndex(+e.target.getzIndex() + 5);
        },
        markerInputClick(e) {
            let curCheck = e.target;
            let orderId = $(curCheck).data('id');
            let choseOne = this.getOneOrder(orderId);
            if (choseOne.length == 0) console.log('返回值为空');
            if (curCheck.checked) {
                this.choseListOperation('add', choseOne);
            } else {
                this.choseListOperation('redu', choseOne);
            }
        },
        choseListOperation(type, curarray) {
            if (!curarray) {
                return;
            }

            if (type === 'add') {
                curarray.sort = this.choseList.length;
                this.choseList.push(curarray);
            }
            if (type === 'redu') {
                this.choseList = this.choseList.filter(index => {
                    return index.order_id != curarray.order_id;
                });
            }
        },
        getOneOrder(id) {
            let _one = [];
            let self = this;
            for (let order_cur of self.orderList) {
                for (let cur of order_cur.items) {
                    if (cur.order_id == id) {
                        _one = cur;
                    }
                }
            }
            return _one;
        },
        choseRemove(item) {
            this.choseListOperation('redu', item);
            this.choseListOnChange(item);
        },
        choseMoveUp(item, index) {
            this.choseMoveGo(item, index, 1, 'up');
        },
        choseMoveDown(item, index) {
            this.choseMoveGo(item, index, 1, 'down');
        },
        /**
         * [choseMoveGo description]
         * @Author   陈龙
         * @DateTime 2017-07-25
         * @version  [version]
         * @param    {[type]}   item    订单信息
         * @param    {[type]}   index   当前索引
         * @param    {[type]}   goIndex 准备跳转的索引
         * @param    {[type]}   type    上移还是下移
         */
        choseMoveGo(item, index, goIndex, type) {
            if (type === 'up') {
                this.choseList.splice(index - goIndex, 0, item);
                this.choseList.splice(index + 1, 1);
            }
            if (type === 'down') {
                this.choseList.splice(index + goIndex + 1, 0, item);
                this.choseList.splice(index, 1);
            }
        },
        choseChange(type, item) {
            //侧滑子菜单input点击相应
            this.choseListOperation(type, item);
            this.choseListOnChange(item, type);
        },
        mapMarkerInputClick(e) {
            //监听地图点击元素为input
            if (e.target.nodeName === 'INPUT') {
                this.markerInputClick(e);
                this.markerInputUpdate(e);
            }
        },
        markerInputUpdate(e) {
            //地图元素选择重构
            let iOld = e.target,
                iParent = iOld.parentNode;
            iOld.remove();
            iParent.insertBefore(iOld, iParent.firstChild);
        },
        choseListOnChange(item, type = "redu") {
            //列表上面的移除和增加对地图上的marker的重构
            let self = this;
            self.markers.map(index => {
                let _p = $(index.getContent()),
                    _m = _p.find('input.circle');
                if (_m.data('id') == item.order_id) {

                    if (type === 'redu') {
                        _m[0].removeAttribute('checked');
                    }
                    if (type === 'add') {
                        _m[0].setAttribute('checked', true);
                    }
                    index.setContent(_p.prop('outerHTML'));
                }
            });
        },
        orderListAddDistance(){
            let self = this;
            AMap.service('AMap.Driving', function() { //回调函数
                //实例化Driving
                let driving = new AMap.Driving({
                    policy: AMap.DrivingPolicy.LEAST_DISTANCE
                });
                self.orderList.map(order=>{
                    order.items = order.items.map(item=>{
                        driving.search(self.$mapCenter, [item.location.longitude, item.location.latitude], (status, result) => {
                            if (status == 'complete') {
                                item.distance = result.routes[0].distance/1000+'km';
                            }
                        });
                        return item;
                    })
                })
            });
        }
    },
    watch: {
        'map': function(n, o) {
            let self = this;
            if(self.operationType === 'edit' && self.choseList.length <= 0){
                return;
            }
            if (self.orderList.length > 0 && self.initCount === 0) {
                self.initCount = 1;
                self.mapMarkerInit();
                self.orderListAddDistance();
            }
        },
        'orderList': {
            handler: function(n, o) {
                let self = this;
                if(self.operationType === 'edit' && self.choseList.length <= 0){
                    return;
                }
                if (self.map != '' && self.initCount === 0 ) {
                    self.initCount = 1;
                    self.mapMarkerInit();
                    self.orderListAddDistance();
                }
            },
            deep: true
        },
        'choseList':{
            handler: function(n, o) {
                let self = this;
                for (let cur of self.orderList) {
                    cur.items = cur.items.map(index => {
                        let _checked = false;
                        if (self.choseList.length != 0) {
                            _checked = self.choseList.filter(chose => chose.order_id == index.order_id).length == 1 ? true : false;
                        }
                        index.ischecked = _checked;
                        return index;
                    })
                }
            },
            deep: true
        }
    },
    components: {
        'operation-nav': operationNav
    }
}

</script>
