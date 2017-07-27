<template>
    <div class="hello">
        <div id="container"></div>
    </div>
</template>
<script> 
import { mapLoad } from './map/map';

export default {
    name: 'hello',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    },
    mounted() {
    	var self = this;
    	mapLoad('b2a77f35f8b6d8690bb6988a626d4f17').then(AMap => {
    		self.map = new AMap.Map('container',{
    			center:[104.065837,30.657349],
    			zoom:14,
    			zooms:[5,18]
    		})
    		
    	})
    }
}
</script>
