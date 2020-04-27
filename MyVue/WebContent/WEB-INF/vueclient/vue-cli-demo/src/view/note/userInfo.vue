<template>
  <el-form :model="userData" label-width="100px" style="width: 500px;height: 600px;margin: 10px auto 0 auto; padding-top: 50px;" disabled>
    <el-form-item label="账号" prop="userName">
      <el-input v-model="userData.userName"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="passWord">
      <el-input v-model="userData.passWord" type="text"></el-input>
    </el-form-item>
    <el-form-item label="名字" prop="name">
      <el-input v-model="userData.name"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="userData.address"></el-input>
    </el-form-item>
    <el-form-item label="用户类型" prop="address">
      <el-select v-model="userData.yes" placeholder="请选择类型" style="float:left;width: 200px;">
        <el-option
          v-for="item in options"
          :label="item.value"
          :key="item.value"
          :value="item.key">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'userInfo',
  props: {
    userId: {
      type: String
    }
  },
  data() {
    return {
      userData: {},
      options: [{key: 1, value: '普通用户'}, {key: 2, value: 'VIP'}, {key: 3, value: '管理员'}]
    }
  },
  methods: {
    closeInfo() {

    }
  },
  mounted() {
  this.$api.getCurrentUser({'id':this.userId}).then(re=>{
    if(re.id==this.userId){
      this.userData=re;
    }else{
      this.$message.error({message: '用户信息获取失败，请重新登录', center: true})
    }
  }).catch(er=>{
    this.$message.error({message: '服务器异常', center: true})
  })
  }
}
</script>

<style scoped>

</style>
