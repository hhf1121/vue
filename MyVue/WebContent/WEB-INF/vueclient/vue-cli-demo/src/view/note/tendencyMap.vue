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
    series: []
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
        var init = echarts.init(document.getElementById("chart2"));
        option.legend.data=[];
        option.series=[];
        option.xAxis.data=[];
        //数据字典
        this.$api.getDataByConfigCode({"configCode":'cost_type'}).then(er=>{
          if(er.success){
            if(er.data.length>0){
              option.legend.data=er.data.map(o=>{
                return o.typeLabel;
              });
              //路由赋值
              let data=[];
              this.$api.getAllNote({"from":this.ruleForm.queryData,"now":this.ruleForm.nowData}).then(re=>{
                if(!re.success||re.data.length==0){
                  init.setOption(option);
                  this.$message.error({message: '此时间段，没有记录信息', center: true})
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
                option.legend.data=data[0].lists.map(o=>{
                  return o.name;
                });
                //4.根据类型、分类
                option.series=[];
                for (let i = 0; i < data[0].lists.length; i++ ) {
                  var obj={};
                  obj.name=data[0].lists[i].name;
                  obj.type='line';
                  obj.smooth=true;
                  obj.color=data[0].lists[i].color;
                  obj.data=[];
                  option.series.push(obj);
                }
                //处理一组数据(类型)
                for (let xx = 0; xx < data.length; xx++) {
                  for(let yy=0;yy<data[xx].lists.length;yy++){
                    for (let zz=0;zz<option.series.length;zz++){
                      if(option.series[zz].name==data[xx].lists[yy].name){
                        option.series[zz].data.push(data[xx].lists[yy].count);
                      }
                    }
                  }
                }
                // 使用刚指定的配置项和数据显示图表。
                init.setOption(option);
              }).catch(err=>{
                this.$message.error({message: '请求失败', center: true})
                return;
              })
            }
          }
        }).catch(err=>{
          this.$message.error({message: '字典：[cost_type]请求错误', center: true})
        });
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
