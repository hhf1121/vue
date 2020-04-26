<template>
    <div>
      <el-form style="float: left;margin-top: 0px;color: red;z-index: -1;position:relative">
      <el-form-item>
        <!--<el-button type="primary" @click="$router.back(-1)">上一步</el-button>-->
        <el-button type="primary" @click="$router.push({name: 'menu', params: {}})">返回菜单</el-button>
      </el-form-item>
      </el-form>
      <div id="chart" style="width: 100%;height: 760px;z-index: 1;float: right"></div>
    </div>
</template>

<script>
  import echarts from 'echarts'//引入echarts
  import 'echarts/map/js/china'// 引入地图

  // 指定图表的配置项和数据
  let option = {
    title:{
      text:'',
      x:'center',//居中
      textStyle:{//标题样式
        color:'#000000',
        fontSize:16,
        fontFamily:'楷体'
      }
    },
    tooltip:{//提示信息
      trigger:'item',//类型
      //地图：{a}系列名称、{b}区域名称、{c}合并数值、{d}无
      // formatter:'地区：{b}<br/>确诊:{c}<br/>新增:{c}'
      //函数方式：
      // formatter:function (e) {
      //   return "地区:"+e.name+"<br/>"+"确诊:"+e.value+"<br/>"+"新增:"+e.conadd+"<br/>"+"死亡:"+e.deathNum;
      // }
      formatter: function(e){
        ;
        var res = "地区:"+e.name+"<br/>"
        //定义一个变量来保存series数据系列
        var myseries=option.series;
        //循环遍历series数据系列
        for(var i=0;i<myseries.length;i++){
          //在内部继续循环series[i],从data中判断：当地区名称等于params.name的时候就将当前数据和名称添加到res中供显示
          for(var k=0;k<myseries[i].data.length;k++){
            //console.log(myseries[i].data[k].name);
            //如果data数据中的name和地区名称一样
            if(myseries[i].data[k].name==e.name){
              //将series数据系列每一项中的name和数据系列中当前地区的数据添加到res中
              res+=myseries[i].name+':'+myseries[i].data[k].value+'<br />';
            }
          }
        }
        return res;
      }
    },
    series: [
      {
        name:'确诊',
        type: 'map',
        map: 'china',
        data: [],
        label:{//图形上的文本标签，可用于说明图形的一些数据信息
          show:true,
          color:'red',
          fontSize:10
        },
        zoom:1.2,//当前视角的缩放比例
        itemStyle:{//地图区域的多边形 图形样式
          borderColor:'blue'
        },
        emphasis:{
          label:{//图形上的文本标签，可用于说明图形的一些数据信息
            color: '#fff',
            fontSize: 12
          },
          itemStyle: {//地图区域多边形的图形样式
            borderColor: 'blue'
          }
        }
      },
      {
        name:'新增',
        type: 'map',
        map: 'china',
        data: []
      },
      {
        name:'现有',
        type: 'map',
        map: 'china',
        data: []
      },
      {
        name:'死亡',
        type: 'map',
        map: 'china',
        data: []
      }
      ],
    visualMap:{//视觉地图
      //分段型
      type:'piecewise',
      show:true,
      pieces:[
        {min:10000},//不指定max、表示无限大
        {min:1000,max:9999},
        {min:100,max:999},
        {min:10,max:99},
        {min:1,max:9},
        {value:0}//不指定min，min为无限
      ],
      //拖拽型
      // min:800,
      // max:50000,
      // text: ['High','Low'],
      // realtime:false,
      // calculable:true,
      inRange:{
        // color:['lightskyblue','yellow','orangered']
         color:['#fff','#ffaa85','#660208']
      },
      itemWidth:10,
      itemHeight:10
    }
  };
  export default {
        name: "china",
      data(){
        return{
          chart:''
        }
      },
      methods:{
        init(){
          var init= echarts.init(document.getElementById("chart"));
            //路由赋值
          const initdata=this.$route.query.initData;
          
            option.title.text="vue模拟疫情地图-"+initdata.time;
            var data=initdata.data;
            option.series[0].data=[];
            option.series[1].data=[];
            option.series[2].data=[];
            option.series[3].data=[];
            for (let i = 0; i < data.length; i++) {
              option.series[0].data.push({name:data[i].name,value:data[i].qz});//总数
              option.series[1].data.push({name:data[i].name,value:data[i].xz});//新增
              option.series[2].data.push({name:data[i].name,value:data[i].xy});//现有
              option.series[3].data.push({name:data[i].name,value:data[i].sw});//死亡
            }
            // 使用刚指定的配置项和数据显示图表。
            init.setOption(option);
            // console.log(option.series[0].data)

        },
    },
      mounted(){
        this.init();
      }
    }
</script>

<style scoped>

</style>
