<template>
    <div>
      <el-form style="float: left;margin-top: 0px;color: red">
        <el-form-item>
          <el-button type="primary" @click="$router.back(-1)">上一步</el-button>
          <el-button type="primary" @click="$router.push({name: 'menu', params: {}})">返回菜单</el-button>
        </el-form-item>
      </el-form>
      <div id="chart2" style="width: 100%;height: 100%"></div>
    </div>
</template>

<script>
  import echarts from 'echarts'
    export default {
        name: "about",
      methods:{
        init(){
          var init = echarts.init(document.getElementById("chart2"));
          // 指定图表的配置项和数据
          var option = {
            title: {
              text: '详情'
            },
            tooltip: {},
            legend: {
              data:['销量']
            },
            xAxis: {
              data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }]
          };

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
