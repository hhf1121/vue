<template>
  <div>
    <router-link :to="{path:'/ChinaMap/china',query:{initData}}"><span class="my-class">地图</span></router-link>
    <router-link :to="{path:'/ChinaMap/about',query:{initData}}"><span class="my-class">详情</span></router-link>
    <router-view />
  </div>

</template>

<script>
  export default {
    name: "china-map",
    data(){
      return{
        initData:{}
      }
    },
    methods:{

    },
    mounted(){
      //获取数据
      let _that=this;
      this.$jsonp('http://interface.sina.cn/news/wap/fymap2020_data.d.json').then(re=>{//?_=1580892522427
        _that.initData.time=re.data.times;
        _that.initData.data=re.data.list.map(e=>{
          return {name:e.name,qz:e.value,xz:e.conadd,sw:e.deathNum,xy:e.econNum};//省区，总数，新增，死亡，现有
        });
      }).catch(err=>{
        console.log("网络异常、读取本地数据");
        _that.initData.time=mapjson.data.times;
        _that.initData.data=mapjson.data.list.map(e=>{
          return {name:e.name,qz:e.value,xz:e.conadd,sw:e.deathNum,xy:e.econNum};//省区，总数，新增，死亡，现有
        });
      })
    }
  }
</script>

<style scoped>
.my-class{
  color: #303133;
  font-size: 20px;
  display: inline-block;
  border: #8cc5ff 1px double;
  text-shadow: #2c3e50;
  border-radius: 5px;
  box-shadow: 2px 4px 6px #000;
}
</style>

