<template>
<el-form :inline="true" :model.sync="queryData" ref="queryForm">
  <el-form-item  label="标题" prop="noteTitle">
    <el-select
      v-model="queryData.noteTitle"
      filterable
      clearable
      remote
      no-match-text
      reserve-keyword
      placeholder="请输入标题"
      :remote-method="remoteMethod"
      :loading="selectloading">
      <el-option
        v-for="item in selectoptions"
        :checked="titleChecked"
        @click="titleChecked=!titleChecked"
        v-highlight="queryDate"
        :key="item.idStr"
        :label="item.noteTitle"
        :value="item.noteTitle">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="用户" prop="noteName">
    <el-input v-model="queryData.noteName" placeholder="输入用户名字"></el-input>
  </el-form-item>
  <el-form-item label="金额"  @mouseover.native='detail=true' @mouseout.native="detail=false" prop="noteMoney">
    <el-input-number v-model="queryData.noteMoney" ></el-input-number>
    <div style="position: absolute;left: -10px;color: red;font-size: 15px;font-family: 楷体" v-show="detail">查询到不小于此金额的数据</div>
  </el-form-item>
  <el-form-item label="相关备注" prop="noteRemark">
    <el-input v-model="queryData.noteRemark" placeholder="输入备注关键字"></el-input>
  </el-form-item>
  <el-form-item  label="花销类型" prop="noteType">
    <el-select clearable  v-model="queryData.noteType" @click="typeChecked=!typeChecked" :checked="typeChecked" placeholder="选择类型" >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item  label="职业" prop="workTypes">
    <el-select clearable multiple  v-model="queryData.workTypes" @click="typeChecked=!typeChecked" :checked="typeChecked" placeholder="选择类型" >
      <el-option v-for="item in workOptions" :key="item.value" :label="item.label" :value="item.value" ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">查询</el-button>
    <el-button type="primary" @click="onClear('queryForm')">重置</el-button>
  </el-form-item>
</el-form>
</template>
<script>
export default {
  name:"Query",
  props:{
    queryData:{
      type: Object,
      default(){
        return{
          noteTitle:'',
          noteName:'',
          noteType:'',
          noteAddress:'',
          noteRemark:'',
          noteMoney:''
        }
      }
    }
  },
  data(){
    return{
      detail:false,
      // options:this.NoteType,//读取前端静态文件notetype.js
      options:[],// 改为后端配置，调用接口
      workOptions:[],// 改为后端配置，调用接口
      selectloading:false,
      selectoptions:[],
      initdata:[],
      queryDate: '',
      titleChecked:false,
      typeChecked:false
    }
  },
  methods:{
    onSubmit() {
      this.$emit('queryFresh')
    },
    onClear(queryForm){
      this.queryData.noteType='';
      this.selectoptions=[];
      this.$refs[queryForm].resetFields();//清空表数据
    },
    remoteMethod(data){//输入值发生变化时调用

     if(data!=''){
       this.selectloading=true;
       this.queryDate = data;
       // setTimeout(()=>{
         this.selectloading = false;
         this.selectoptions = this.initdata.filter(item => {
           return item.noteTitle.indexOf(data) > -1;
         });
     }else{
       this.selectoptions=[];
     }
    },
    initData(){
      this.$api.queryNotesTitle({"title":this.queryData.noteTitle}).then(er=>{
        this.initdata=er;
      }).catch(err=>{
        this.selectloading=false;
        this.$message.error({message: '标题数据，请求错误', center: true})
      })
      //数据字典
      this.$api.getDataByConfigCode({"configCode":'cost_type'}).then(er=>{
        if(er.success){
          if(er.data.length>0){
            this.options=er.data.map(o=>{
              var object={};
              object.label=o.typeLabel;
              object.value=o.typeValue;
              return object;
            });
          }
        }
      }).catch(err=>{
        this.$message.error({message: '字典：[cost_type]请求错误', center: true})
      });
      this.$api.getDataByConfigCode({"configCode":'work_type'}).then(er=>{
        if(er.success){
          if(er.data.length>0){
            this.workOptions=er.data.map(o=>{
              var object={};
              object.label=o.typeLabel;
              object.value=o.typeValue;
              return object;
            });
          }
        }
      }).catch(err=>{
        this.$message.error({message: '字典：[work_type]请求错误', center: true})
      });
    }
  },
  mounted(){//初始带出所有的数据
    this.initData();
  }
}
</script>
