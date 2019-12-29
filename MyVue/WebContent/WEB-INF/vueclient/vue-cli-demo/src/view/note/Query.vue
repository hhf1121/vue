<template>
<el-form :inline="true" :model.sync="queryData" ref="queryForm">
  <el-form-item label="标题" prop="noteTitle">
    <el-input v-model="queryData.noteTitle" placeholder="输入标题"></el-input>
  </el-form-item>
  <el-form-item label="用户" prop="noteName">
    <el-input v-model="queryData.noteName" placeholder="输入用户名字"></el-input>
  </el-form-item>
  <el-form-item label="金额"  @mouseover.native='detail=true' @mouseout.native="detail=false" prop="noteMoney">
    <el-input-number v-model="queryData.noteMoney" ></el-input-number>
    <span style="position: absolute;left: -10px;color: red;font-size: 15px;font-family: 楷体" v-show="detail">查询到不小于此金额的数据</span>
  </el-form-item>
  <el-form-item label="相关备注" prop="noteRemark">
    <el-input v-model="queryData.noteRemark" placeholder="输入备注关键字"></el-input>
  </el-form-item>
  <el-form-item label="花销类型" prop="noteType">
    <el-select filterable v-model="queryData.noteType" placeholder="选择类型">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
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
      options:this.NoteType
    }
  },
  methods:{
    onSubmit() {
      this.$emit('queryFresh')
    },
    onClear(queryForm){
      this.$refs[queryForm].resetFields();//清空表数据
    }
  }
}
</script>
