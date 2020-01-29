<template>
  <div style="padding-top: 50px">
    <h3>用户登录</h3>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
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
  </div>
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.login({"userName":this.ruleForm.username,"passWord":this.ruleForm.pass}).then(res => {
                  if (res.data == null) { // 密码或账号错误
                    this.$message.error({message: '密码或账号错误', center: true})
                  } else {
                    this.$message.success({message: '登录成功', center: true})
                    // 成功之后:
                    // 1.菜单展示用户信息
                    //用以下方式，将用户信息传递 user:res.data
                    this.$root.USER = res.data;
                    // 保存：session
                    sessionStorage.setItem('user', JSON.stringify(res.data));
                    // 2.路由到数据列表,传参id查询此用户类型的数据
                    this.$router.push(
                      {
                        name: 'menu', params: {
                          id: res.data.yes,
                          user:res.data
                        }
                      })
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .demo-ruleForm {
    background-color: #92dfff;
    padding-top: 30px;
    width: 450px;
    border: 1px rgba(1, 5, 4, 0.15) solid;
    margin: 0 auto
  }
</style>
