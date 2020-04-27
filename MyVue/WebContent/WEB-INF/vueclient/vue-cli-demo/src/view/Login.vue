<template>
  <div style="padding-top: 50px">
    <h3>用户登录</h3>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
      <el-form-item label="账号" prop="username">
        <el-input type="text" v-model="ruleForm.username"  style="width: 350px" @blur="getVerifyCode"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" style="width: 350px"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verifycode" label-width="60px" >
        <el-input clearable type="text" v-model="ruleForm.verifycode" style="float: left;position:relative;left:15px;width: 180px;font-size: 6px" placeholder="请输入图中的运算结果"></el-input>
        <img :src="imgSrc" style="width: 150px;height: 36px" alt="验证码" title="验证码只能使用一次" width="150px" v-show="isShowImg">
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
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
    var validateverifycode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        username: '',
        verifycode:''
      },
      imgSrc:'',
      isShowImg:false,
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        username: [
          {validator: validateUserName, trigger: 'blur'}
        ],
        verifycode: [
          {validator: validateverifycode, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.login({"userName":this.ruleForm.username,"passWord":this.ruleForm.pass,"verifyCode":this.ruleForm.verifycode}).then(res => {
                if(!res.success){
                  this.$message.error({message: res.error+"", center: true})
                }else if (res.data == null) { // 密码或账号错误
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
    keyupForm(e){
      if(e.keyCode == 13){//回车键
        this.submitForm('ruleForm');
      }

    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getVerifyCode(){
      if(this.ruleForm.username){
        this.$api.getVerifyCode({"userName":this.ruleForm.username}).then(result=>{
          if(result.success){
            this.imgSrc="data:image/png;base64,"+result.data;
            this.isShowImg=true;
          }else{
            this.isShowImg=false;
            this.$message.error({message: result.error, center: true})
          }
        }).catch(err=>{
          this.$message.error({message: '请求错误', center: true})
        })
      }
    }
  },
  mounted() {
    //绑定回车事件、调用keyupForm
    window.addEventListener('keydown',this.keyupForm);
  },
  destroyed(){//销毁
    window.removeEventListener('keydown',this.keyupForm,false);
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
