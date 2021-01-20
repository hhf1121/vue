<template>
  <div>
    <el-button @click="$router.push({name: 'menu', params: {}})" style="cursor:pointer;color: #8cc5ff">返回首页</el-button>
    <iframe :src="url" frameborder="0" style="display: block;height: 800px;width: 1000px" id="iframeBox"></iframe>
    <!--<v-html-panel style="width: 100%;height: 100%" :url.asyc="url"></v-html-panel>-->
  </div>

</template>
<style scoped>
  div{color:red}
</style>
<script>
  import vHtmlPanel from './../myComponents/vHtmlPanel';
  export default{
    name:'MyGame',
    components:{vHtmlPanel},
    data () {
      return {
        url: '',
      }
    },
    mounted () {
      // this.url = 'http://localhost:63342/tuling-teach-netty/SnakeGamePage.html'
      // this.url = 'http://localhost:63342/tuling-teach-netty/SnakeGamePage.html?_ijt=5qe7bbk2adalvcm2fn8a75nrv4'
      this.url = 'http://learn.hhf.com/resources/static/games/SnakeGamePage.html'
    },
    methods: {
    }
  }
</script>
