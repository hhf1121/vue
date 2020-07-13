<template>
  <div style="width: 800px;display: inline-block;align:center">
    <div style="float: left;position: relative;align:center">
      <el-input v-model="input" placeholder="请输入新增项" style="width: 130px"></el-input>
      <el-color-picker v-model="showColor" style="float: right"></el-color-picker>
      <el-button type="success"  circle style="position: absolute;top: 0px;margin-left: 45px"  @click="addList(input)">＋</el-button>
    </div>
    <div>
      <el-button type="primary"  style="position: absolute;float: right" @click="freshConfig">刷新</el-button>
    </div>
    <br>
    <br>
    <br>
    <el-transfer v-model="value" :data="data" :titles="['新增未确认项','当前已确认项']" style="float: left"></el-transfer>
    <br>
    <div style="position: absolute;bottom: 0px;margin-left: 233px">
      <el-button type="primary" @click="saveConfig">保存</el-button>
    </div>
  </div>
</template>

<script>
  let initKey=[];
  export default {
    name: "ConfigEdit",
    data() {
      return {
        data: [],//全部的数据
        value: [],//已选的数据的key
        input:'',
        showColor:''//颜色
      };
    },
    methods:{
      addList(input){
        if(input){
          if(!this.showColor){
            this.$alert('请为此配置添加一种统计图的展示颜色', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            });
            return;
          }
          //遍历，保存所有的key
          var max=this.data.map(o=>{
            return o.key;
          })
          var name=this.data.map(o=>{
            return o.label;
          })
          if(name.indexOf(input)!=-1){
            this.$message.error({message: '名字不能重复', center: true})
            return;
          }
          var obj={};
          obj.key=Math.max(...max)+1;//取最大的key+1
          obj.label=input;//名字是输入的
          obj.color=this.showColor;
          this.data.push(obj);
          this.input='';
          this.showColor='';
          //删除新增元素的选中状态
          // let index=this.value.indexOf(obj.input);
          // this.value.splice(index, 1);
        }
      },
      saveConfig(){
        //已选
        // this.value.map(o=>{
        //   console.info(o);
        // });
        if(initKey.toString()==this.value.toString()){
          this.$alert('数据未作修改,请先修改再保存', '提示', {
            confirmButtonText: '我知道了',
            callback: action => {
            }
          });
          return;
        }
        //根据已选key，保存相应的数据。
        let param=this.data.filter(o=>{
          return this.value.indexOf(o.key)!=-1;
        })
        let requestParam={};
        requestParam.lists=param;
        requestParam.configCode='cost_type';
        this.$api.saveConfig(requestParam).then(res=>{
          if(res.success){
            this.$message.success({message:res.data,center:true});
            //重置初始选择
            // initKey=this.value;
            this.init();
          }else {
            this.$message.error({message: res.error, center: true})
          }
        }).catch(err=>{
          this.$message.error({message: '请求错误', center: true})
        })
      },
      freshConfig(){
        this.init();
      },
      init(){
        //数据字典
        this.$api.getDataByConfigCode({"configCode":'cost_type'}).then(er=>{
          if(er.success){
            if(er.data.length>0){
              this.data=er.data.map(o=>{
                var object={};
                object.label=o.typeLabel;
                object.key=o.typeValue;
                return object;
              });
              this.value=this.data.map(o=>{
                return o.key;
              })
            }
            initKey=this.value;
          }
        }).catch(err=>{
          this.$message.error({message: '字典：[cost_type]请求错误', center: true})
        })
      }
    },
    mounted(){
     this.init();
    }
  }
</script>

<style scoped>
  /deep/ .el-transfer-panel{
    width: 220px !important;
  }
  /*加上deep可修改样式*/
  /deep/ .el-transfer-panel .el-checkbox__inner {
    margin-left: -50px;
    /*float: left;*/
    /*position: absolute;*/
  }
</style>
