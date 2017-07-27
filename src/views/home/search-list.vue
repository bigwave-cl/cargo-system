<template>
    <div class="map-searche-result">
        <ul>
            <li class="no" v-if="result.isShow && result.isNull">
                <div class="text">{{result.text}}</div>
            </li>
            <li v-if="result.isShow && !result.isNull" v-for="r in result.list" :key='r.id' @click="moveTo(r.location)">
                <div class="text num">{{r.number}}</div>
                <div class="text">{{r.name}}</div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['result', 'map'],
    datas: {
        return () {

        }
    },
    methods: {
        moveTo(location) {
            this.map.panTo([location.longitude,location.latitude]);
        }
    }
}
</script>
