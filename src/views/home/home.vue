<template>
    <div class="cgm-home">
        <div class="map-search">
            <input v-model.trim="mapSearch" type="text" name="mapSearch" class="map-input" placeholder="输入客户编号或客户名称">
            <label class="map-label" @click.stop="searchRun()">搜索</label>
            <search-list :result="mapReuslt" :map="map"></search-list>
        </div>
        <div class="map-tag">
            <ul class="map-count">
                <li>
                    <div class="icon">
                        <img src="../../assets/icon_tool.png">
                    </div>
                    <div class="text">
                        <span class="num">{{customer.sleep}}</span>
                        <span>沉睡客户</span>
                    </div>
                </li>
                <li>
                    <div class="icon">
                        <img src="../../assets/icon_tool_flag.png">
                    </div>
                    <div class="text">
                        <span class="num">{{customer.delivery}}</span>
                        <span>送货客户</span>
                    </div>
                </li>
            </ul>
            <div class="map-close" @click="mapClose"></div>
        </div>
        <div id="map_home" class="map-container"></div>
        <loading slot="footer" v-for="(load,$i) in loading" :show="load.show" :key="$i"></loading>
        <ask-toast slot="footer" v-for="toast in askToast" :msg="toast.msg" :key="toast"></ask-toast>
    </div>
</template>
<script>
import {
    mapLoad
} from '@/components/map/map';
import SearchList from './search-list';
export default {
    name: 'hello',
    data() {
        return {
            mapSearch: '',
            mapSearchChangTime: '',
            mapReuslt: {
                isShow: false,
                isNull: true,
                text: '暂无相关数据'
            },
            map: '',
            tagList:[],
            askToast:[],
            initCount:0,
            loading:{
                homeCustomer:{show:false}
            },
            customer:{
                sleep:0,
                delivery:0
            }
        }
    },
    created() {
        let self = this;
        //订单数据
        self.$http.get(
            self.$api.home_customer, {
                platform_id: self.$platformId
            }, {
                before: response => {
                    //弹框遮罩层
                    self.loading.homeCustomer.show = true;
                }
            }
        ).then(response => {
            self.loading.homeCustomer.show= false;
            if(response.data.code != 1000){
                self.toastShow(response.data.message ? response.data.message:'接口访问异常！');
                return;
            }
            self.tagList = response.data.result.items;
            self.customer.sleep = response.data.result.sleep;
            self.customer.delivery = response.data.result.delivery;
        }, response => {
            self.loading.homeCustomer.show= false;
            self.toastShow(response.data.message ? response.data.message:'接口访问失败！');
        });
    },
    mounted() {
        let self = this;

        $('body').on('click', function() {
            self.mapReuslt = {
                isShow: false,
                list: []
            };
        });
        mapLoad(self.$mapKey).then(AMap => {
            self.map = new AMap.Map('map_home', {
                center: self.$mapCenter,
                zoom: 17,
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
        mapMarkerInit(){
            let self = this;
            for (let tag of self.tagList) {
                let tagIcon = tag.type === 1 ? 'flag' : 'tool';
                let content = `<div class="map-point-box">
                                    <div class="map-point-main">
                                        <div class="details">
                                            <div class="text mark-large">${tag.number}</div>
                                            <div class="text">${tag.name}</div>
                                        </div>
                                    </div>
                                    <div class="map-point ${tagIcon}">
                                    </div>
                                </div>`;
                let marker = new AMap.Marker({
                    position: [tag.location.longitude,tag.location.latitude],
                    content: content,
                    offset: new AMap.Pixel(-115, -140),
                    map: self.map
                });
                marker.on('click', self.markerClick);
            }
            self.map.setFitView();
            self.map.on('click', function(e) {
                self.mapReuslt = {
                    isShow: false,
                    list: []
                };
            });
        },
        searchRun() {
            let self = this;
            if (self.mapSearch !== '') {
                self.$http.get(
                    self.$api.home_customer, {
                        platform_id: self.$platformId,
                        keywords: self.mapSearch
                    }, {
                        before: response => {
                            //弹框遮罩层
                            // self.loading.homeCustomer.show = true;
                        }
                    }
                ).then(response => {
                    // self.loading.homeCustomer.show= false;
                    if(response.data.code != 1000){
                        self.toastShow(response.data.message ? response.data.message:'接口访问异常！');
                        return;
                    }
                    if(response.data.result.items.length == 0){
                        self.mapReuslt = {
                            isShow: true,
                            isNull: true,
                            text: '暂无相关数据'
                        }
                    }else{
                        self.mapReuslt = {
                            isShow: true,
                            isNull: false,
                            list: response.data.result.items
                        }
                    }
                }, response => {
                    // self.loading.homeCustomer.show= false;
                    self.toastShow(response.data.message ? response.data.message:'接口访问失败！');
                });
            }
        },
        markerClick(e) {
            $(e.target.getContentDom())
                .closest('.amap-marker')
                .siblings('.amap-marker')
                .css({
                    'z-index': '' + e.target.getzIndex()
                });
            e.target.setzIndex('' + e.target.getzIndex() + 5);
        },
        mapClose(){
            window.location.href=this.$config.jump.close;
        }
    },
    watch: {
        'mapSearch': function(n, o) {
            let self = this;

            if (self.mapSearchChangTime) clearTimeout(self.mapSearchChangTime);

            self.mapSearchChangTime = setTimeout(() => {
                self.searchRun();
            }, 500)
        },
        'map': function(n, o) {
            let self = this;
            if (self.tagList.length > 0 && self.initCount === 0) {
                self.initCount = 1;
                self.mapMarkerInit();
            }
        },
        'tagList': function(n, o) {
            let self = this;
            if (self.map != '' && self.initCount === 0) {
                self.initCount = 1;
                self.mapMarkerInit();
            }
        }
    },
    components: {
        'search-list': SearchList
    }
}

</script>
