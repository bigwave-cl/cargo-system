<template>
    <nav class="cgm-nav">
        <ul class="cgm-nav-list">
            <router-link to="/home" tag="li" v-bind:class="{active: type == 1}">
                <img src="../assets/icon_clientele.png">
            </router-link>
            <router-link to="/client-dis" tag="li" v-bind:class="{active: type == 2}">
                <img src="../assets/icon_distribution.png">
            </router-link>
            <li v-bind:class="{active: type == 3}">
                <a :href="$config.jump.master">
                    <img src="../assets/icon_master.png">
                </a>
            </li>
            <li v-bind:class="{active: type == 4}">
                <a :href="$config.jump.clock">
                    <img src="../assets/icon_clock_in.png">
                </a>
            </li>
           <!--  <router-link :to="$config.jump.master" tag="li" v-bind:class="{active: type == 3}">
                <img src="../assets/icon_master.png">
            </router-link>
            <router-link :to="$config.jump.clock" tag="li" v-bind:class="{active: type == 4}">
                <img src="../assets/icon_clock_in.png">
            </router-link> -->
        </ul>
    </nav>
</template>
<script>
export default {
    props: ['type']
}
</script>
