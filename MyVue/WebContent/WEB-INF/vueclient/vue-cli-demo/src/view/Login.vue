<template>
  <div class="mybody">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="50px" class="loginstyle" v-if="!isWx">
          <h4 style="margin-top: -20px">用户登录</h4>
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model="ruleForm.username"  style="width: 220px;float: left" @blur="getVerifyCode"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" >
          <el-input type="password" v-model="ruleForm.pass" style="width: 220px;float: left"  show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifycode" label-width="55px" >
          <el-input clearable type="text" v-model="ruleForm.verifycode" style="float:left;margin-left:-5px;position:relative;width:150px" placeholder="请输入运算结果"></el-input>
          <img :src="imgSrc" alt="验证码" title="验证码只能使用一次" style="margin-left: -30px" width="60px" height="35px" v-show="isShowImg">
        </el-form-item>
        <el-form-item style="float: left;position: relative;">
          <router-link to="/register" style="float: left;z-index: 2;position: relative;">注册账号</router-link>
        </el-form-item>
        <el-form-item style="z-index: 1">
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <a style="float: left;z-index: 2;position: relative;" href="#" @click="wxLogin">二维码登录</a>
        </el-form-item>
      </el-form>
    <el-form  label-width="50px" v-if="isWx" class="loginstyle">
      <h4 style="margin-top: -20px">扫码登录</h4>
      <el-form-item style="z-index: 1">
        <img style="margin-left: -50px;" :src="isWxPicture" width="200px" height="200px" >
      </el-form-item>
      <el-form-item >
        <a style="margin-left: -50px;" href="#" @click="returnLogin">返回</a>
      </el-form-item >
    </el-form>
    </div>
</template>

<script>
import axios from 'axios'
import GoodsModel from './sellGoods/goodsModel';

export default {
  name: 'Login',
  components: {GoodsModel},
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
      },
      websocket:null,
      isWx:false,
      isWxPicture:''
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.login({"userName":this.ruleForm.username,"passWord":this.ruleForm.pass,"verifyCode":this.ruleForm.verifycode}).then(res => {
                if(!res.success){
                  this.$message.error({message: res.error+"", center: true})
                  this.getVerifyCode();//重新获取验证码
                }else if (res.data == null) { // 密码或账号错误
                    this.$message.error({message: '密码或账号错误', center: true})
                    this.getVerifyCode();//重新获取验证码
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
    wxLogin(){
        //请求二维码
        this.$api.queryWxPicture().then(rs=>{
            console.info(rs);
            this.isWxPicture = rs.data;
        })
        this.isWx=true;
    },
    returnLogin(){
      this.isWx=false;
      this.isWxPicture = '';
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
  .mybody{
    background:url(../../static/background-lz.jpg);/*登录背景图*/
    width:100%;
    height:100%;
    position:fixed;
    background-size:100% 100%;
  }
  .loginstyle{
    position: absolute;
    top:30%;
    right: 10%;
    width: 300px;
    height: 300px;
    border-radius: 15px;
    background-color: rgba(98, 137, 255, 0.5);
    padding-top: 30px;
    border: 1px rgba(1, 5, 4, 0.15) solid;
    margin: 0 auto
  }
</style>
