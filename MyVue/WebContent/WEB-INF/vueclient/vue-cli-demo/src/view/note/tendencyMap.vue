<template>
    <div>
      <el-form style="float: right"  :rules="rules" :model="ruleForm" ref="ruleForm">
          <el-form-item  prop="queryData" label-width="80px" label="自">
            <el-date-picker  type="date" v-model="ruleForm.queryData" :picker-options="pickerOptions" @blur="getInit('ruleForm')"></el-date-picker>
            至<el-date-picker  type="date" v-model="ruleForm.nowData" disabled></el-date-picker>
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
      text: '花费账单统计流线图',
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
      data:[],//花费类型
    },
    xAxis: {
      type: 'category',
      data: [],//日期
    },
    yAxis: {
      type: 'value',//金额
    },
    series: [
      {
        name:'',
        data: [],//金额
        type: 'line',
        smooth: true,
        color:'#b2149f'
      },
      {
        name:'',
        data: [],
        type: 'line',
        smooth: true,
        color:'green'
      },
      {
        name:'',
        data: [],
        type: 'line',
        smooth: true,
        color:'#b2b2b2'
      },
      {
        name:'',
        data: [],
        type: 'line',
        smooth: true,
        color: 'red'
      }/*,
      {
        name:'当日总额',
        data: [1,2,3,4,5],
        type: 'line',
        smooth: true,
        color: '#b2074c'
      }*/
    ]
  };
    export default {
        name: "tendencyMap",
      data(){
          //回调函数validateTime，中的this指的是它本身，并非vue对象。此处用_that替代
          let _that=this;
        let validateTime = (rule, value, callback) => {
          let now = _that.ruleForm.nowData;
          if (value === undefined || value === '' || value ===null) {
            callback(new Error('请选择起始时间'));
          }else if(value>=now ){
            callback(new Error('起始日期必须在当前日期之前'));
          }else{
            //去后端校验
            _that.$api.getAllNote({"from":_that.ruleForm.queryData,"now":_that.ruleForm.nowData}).then(re=>{
              if(!re.success){
                callback(new Error(re.error+""));
              }else{
                callback();
              }
            }).catch(err=>{
              callback(new Error('请求后端异常'));
            })
          }
        };
          return{
            rules: {//提交校验
              queryData: [
                {required: true, message: '请输入起始时间', trigger: 'blur'},
                {validator : validateTime, type:'date',  trigger: 'blur' }
              ]
            },
            pickerOptions: {
              disabledDate(time) {
                // return time.getTime() > Date.now();
                return false;
              },
              shortcuts: [{
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }, {
                text: '一周前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                }
              }, {
                text: '一月前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', date);
                }
              }, {
                text: '一年前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 365);
                  picker.$emit('pick', date);
                }
              }]
            },
            ruleForm:{
              queryData:new Date(new Date().setTime(new Date().getTime()-3600 * 1000 * 24 * 7)),
              nowData:new Date()
            }
          }
      },
      methods:{
        getInit(formName){//失焦请求
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.init();
            } else {
              console.log('error submit!!')
              return false
            }
          })
        },
        init(){
          debugger
          var init = echarts.init(document.getElementById("chart2"));
          //路由赋值
          let noteStr=this.NoteType;//label、value：名称、值
          //数据字典
          this.$api.getDataByConfigCode({"configCode":'cost_type'}).then(er=>{
            if(er.success){
              if(er.data.length>0){
                  noteStr=er.data.map(o=>{
                  var object={};
                  object.label=o.typeLabel;
                  object.value=o.typeValue;
                  return object;
                });
              }
            }
          }).catch(err=>{
            this.$message.error({message: '字典：[cost_type]请求错误', center: true})
          })
          let data=[];
          this.$api.getAllNote({"from":this.ruleForm.queryData,"now":this.ruleForm.nowData}).then(re=>{
            if(!re.success){
              // this.$message.error({message: re.error+"", center: true});
              return;
            }
            data=re.data;
            //noteType 、noteMoney、timeStr
            //拼装数据：每个类型一组。（展现：某项类型，花费的全部金额、都一个日期list）
            //1.赋值x：日期
            option.xAxis.data=data.map(e=>{
              return e.timeStr;
            });
            //2.赋值类型
            option.legend.data=noteStr.map(e=>{
              return e.label;
            });
            for (var i=0;i<option.series.length;i++){
              for (let j = 0; j < noteStr.length; j++) {
                if(i==j){
                  option.series[i].name=noteStr[j].label;
                  break;
                }
              }
            }
            //4.根据类型、分类
            var seriesData=option.series;
            for (let i = 0; i < seriesData.length; i++) {
              if(option.series[i].name=='衣服'){
                option.series[i].data=data.map(e=>{
                  return e.yfcount;
                })
              }
              if(option.series[i].name=='食物'){
                option.series[i].data=data.map(e=>{
                  return e.swcount;
                })
              }
              if(option.series[i].name=='住宿'){
                option.series[i].data=data.map(e=>{
                  return e.zscount;
                })
              } if(option.series[i].name=='旅行'){
                option.series[i].data=data.map(e=>{
                  return e.lxcount;
                })
              }
              //总金额
              // {name:'', data: [],type: 'line', smooth: true, color:'#b2149f'}
              // option.series.push({
              //   name:'当日总额', data: [],type: 'line', smooth: true, color:'#b2149f'
              // });
            }
            // 使用刚指定的配置项和数据显示图表。
            init.setOption(option);
          }).catch(err=>{
            this.$message.error({message: '请求失败', center: true})
            return;
          })
        }
      },
      mounted(){
          this.init();
      },
      destroyed(){

      }

    }
</script>

<style scoped>

</style>
