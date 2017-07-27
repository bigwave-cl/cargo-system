import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main';
import home from '@/views/home/home';
import clientDistribution from '@/views/client-distribution/client';
import clientInfo from '@/views/client-info/info';
import clientOperation from '@/views/client-operation/operation';

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'main',
        component: main,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'home',
            component: home
        }, {
            path: 'client-dis',
            name: 'client-dis',
            component: clientDistribution
        }, {
            path: 'info/:id',
            name: 'info',
            component: clientInfo
        }, {
            path: 'operation/:type',
            name: 'operation',
            component: clientOperation
        }]
    },
    { path: '*', redirect: '/home' }]
})
