<template>
  <div id="app">
   <!-- <img src="./assets/logo.png">-->
    <div>
     <!-- <router-link to="/">首页</router-link>
      <router-link to="/home">我的</router-link>
      <router-link to="/Down">数据曲线图</router-link>
      <router-link to="/MyData">数据</router-link>
      <router-link to="/D2Table">D2表格</router-link>-->
    </div>
    <div>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
