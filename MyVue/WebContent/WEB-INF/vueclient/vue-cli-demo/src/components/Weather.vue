<template>
  <div >
    <div id="weather-v2-plugin-standard"></div>
  </div>

</template>

<script>
  export default {
    name: 'Weather',
    mounted () {
      //动态加载远程js
      window.WIDGET = {
        CONFIG: {
          "layout": 1,  //1横版、2竖版
          "width": "450",
          "height": "126",
          "background": 2,
          // "city": "CN101020800",//城市代码
          "dataColor": "4A90E2",//字体颜色
          "language": "zh",
          "borderRadius": 5,
          "key": "0u4Kwnd4Ax"
        }
      };
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = "https://apip.weatherdt.com/standard/static/js/weather-standard-common.js?v=2.0"
      document.body.appendChild(s);
    }
  }
</script>
