<template>
    <div>
      <el-form style="float: left;margin-bottom: 10px;color: red;">
        <el-form-item>
          <!--<el-button type="primary" @click="$router.back(-1)">上一步</el-button>-->
          <el-button type="primary" @click="$router.push({name: 'menu', params: {}})">返回菜单</el-button>
        </el-form-item>
      </el-form>
      <div id="chart2" style="width: 100%;height: 500px;padding-top: 50px;float: right"></div>
    </div>
</template>

<script>
  import echarts from 'echarts'
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '',
      x:'75%',//居中
      textStyle:{//标题样式
        color:'#5844d8',
        fontSize:16
      }
    },
    tooltip: {
      trigger:"axis"
    },
    legend: {
      data:['现有','新增','死亡','累计确诊'],
    },
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name:'现有',
        data: [],
        type: 'line',
        smooth: true,
        color:'#b2149f'
      },
      {
        name:'新增',
        data: [],
        type: 'line',
        smooth: true,
        color:'green'
      },
      {
        name:'死亡',
        data: [],
        type: 'line',
        smooth: true,
        color:'#b2b2b2'
      },
      {
        name:'累计确诊',
        data: [],
        type: 'line',
        smooth: true,
        color: 'red'
      }
    ]
  };
    export default {
        name: "about",
      methods:{
        init(){
          var init = echarts.init(document.getElementById("chart2"));
          //路由赋值
          const initdata=this.$route.query.initData;
          var data=initdata.data;
          //赋值标题
          option.title.text='各地疫情详细数据---'+initdata.time;
          //赋值x
          option.xAxis.data=data.map(e=>{
            return e.name;
          })
          //赋值现有
          option.series[0].data=data.map(e=>{
            return e.xy;
          })
          //赋值新增
          option.series[1].data=data.map(e=>{
            return e.xz;
          })
          //赋值死亡
          option.series[2].data=data.map(e=>{
            return e.sw;
          })
          //赋值累计
          option.series[3].data=data.map(e=>{
            return e.qz;
          })
          // 使用刚指定的配置项和数据显示图表。
          init.setOption(option);
        }
      },
      mounted(){
          this.init();
      }
    }
</script>

<style scoped>

</style>
