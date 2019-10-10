<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="账号" prop="username">
      <el-input type="text" v-model="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input type="password" v-model="ruleForm.pass"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        username: ''
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        username: [
          {validator: validateUserName, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 后端请求数据
          axios.get('/api/user/queryByVue?userName=' + this.ruleForm.username + '&passWord=' + this.ruleForm.pass)
            .then(res => {
              debugger
              if (res.data.data == null) { // 密码或账号错误
                this.$message.error({message: '密码或账号错误', center: true})
              } else {
                this.$message.success({message: '登录成功', center: true})
                // 成功之后，路由到数据列表,并查询此用户类型的数据
                this.$router.push({path: '/MyData?yes='+ res.data.data.yes})
              }
              // console.log(res)
            }).catch(err => {
              this.$message.error({message: '请求错误', center: true})
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .demo-ruleForm {
    width: 500px;
    heignt: 300px;
    border: 1px red solid;
    margin: 0 auto
  }
</style>
