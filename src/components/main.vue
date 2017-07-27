<template>
    <div class="container">
        <nav-tab :type="type"></nav-tab>
        <transition :name="transitionName">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import NavTab from '@/components/tab';
export default {
    data() {
        return {
            transitionName: 'slide',
            type: 1
        }
    },
    created(){
        this.type = addSate(this.$route);
    },
    components: {
        NavTab
    },
    watch: {
        // 监视路由，参数为要目标路由和当前页面的路由
        '$route' (to, from) {
            var self = this;
            // const toDepth = to.path.split('/').length
            // const fromDepth = from.path.split('/').length

            // if (toDepth < fromDepth) _V.transitionName = "slide-right";
            // else if (toDepth == fromDepth) {

            //     if (slideRun(to, from)) _V.transitionName = "slide-right";
            //     else _V.transitionName = "slide-left";

            // } else _V.transitionName = "slide-left";

            self.type = addSate(to);
        }
    }
}

var addSate = (arg) => {
	let _t = 1;
	if(arg.name == 'home') _t = 1;
	if(arg.name == 'client-dis' || arg.name == 'info' || arg.name == 'operation') _t = 2;
	if(arg.name == 'personal') _t = 3;
	return _t;
}
</script>
