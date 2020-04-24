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
        name: "china",

    }
</script>

<style scoped>

</style>
