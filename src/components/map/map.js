export const mapLoad = (k) => {
    return new Promise(function(resolve, reject) {
        window.initTheMap = function() {
            resolve(AMap);
        }

        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initTheMap&key=' + k ;
        script.onerror = function(e){
            reject(e);
        };
        document.head.appendChild(script);
    })
}
