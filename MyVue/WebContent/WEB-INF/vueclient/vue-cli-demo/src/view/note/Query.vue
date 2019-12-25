<template>
<el-form :inline="true" :model="queryData">
  <el-form-item label="审批人">
    <el-input v-model="queryData.user" placeholder="审批人"></el-input>
  </el-form-item>
  <el-form-item label="活动区域">
    <el-select filterable v-model="queryData.region" placeholder="活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">查询</el-button>
  </el-form-item>
</el-form>
</template>
<script>
export default {
  name:"Query",
  props:{
    queryData:{type: Object}
  },
  methods:{
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>
