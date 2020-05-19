<template>
  <div>
    <el-button @click="isupdate=!isupdate" style="float: right;margin-right: 100px;position:relative;z-index: 3" v-if="isupdate">修改</el-button>
    <el-button @click="isupdate=!isupdate;flush()" style="float: right;margin-right: 100px;position:relative;z-index: 3" v-if="!isupdate">取消</el-button>
    <el-form style="margin: 10px auto 0 auto;">
      <el-form-item style="width: 600px;margin: auto">
        <h5 v-if="userData.yes==1" style="color: red">普通用户没有菜单操作权限，请<el-button size="mini" @click="sendInfo=true">联系</el-button>管理员</h5>
        <div v-if="sendInfo" style="display: inline" >
          <el-input type="textarea" v-model="msg" ></el-input>
          <el-button type="success"  @click="sendAdmin">提交申请</el-button >
        </div>
      </el-form-item>
    </el-form>
    <el-form :model="userData" label-width="100px" style="width: 500px;height: 600px;margin: 10px auto 0 auto; padding-top: 50px;" >
      <el-form-item :disabled="isupdate">
        <upload-img :userData="userData"  ref="imgUp" @flushData="isupdate=true" v-if="lmgurl.length==0"/>
        <img :src="lmgurl" alt="头像" title="头像" style="margin-left: -30px;border: 1px #5b5b5b dashed;border-radius: 5px" width="150px" height="150px" v-if="lmgurl.length>0" >
      </el-form-item>
      <el-form-item label="账号" prop="userName">
        <el-input v-model="userData.userName" disabled></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passWord">
        <el-input v-model="userData.passWord" type="password" :disabled="isupdate"></el-input>
      </el-form-item>
      <el-form-item label="名字" prop="name">
        <el-input v-model="userData.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="userData.address" :disabled="isupdate"></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="address">
        <!--<el-select v-model="userData.yes" placeholder="请选择类型" style="float:left;width: 200px;">
          <el-option
            v-for="item in options"
            :label="item.value"
            :key="item.value"
            :value="item.key">
          </el-option>
        </el-select>-->
        {{userData.yes|typeFilter}}
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="updateForm" v-show="!isupdate">确定</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import uploadImg from './uploadImg';
export default {
  name: 'userInfo',
  props: {
    userId: {
      type: String
    }
  },
  components:{
    uploadImg
  },
  data() {
    return {
      userData: {},
      msg:'',
      isupdate:true,
      options: [{key: 1, value: '普通用户'}, {key: 2, value: 'VIP'}, {key: 3, value: '管理员'}],
      lmgurl:'',
      sendInfo:false
    }
  },
  methods: {
    updateForm() {//修改
      if(this.lmgurl.length>0){
        let User={
          "passWord":this.userData.passWord,
          "address":this.userData.address,
          "id":this.userData.id,
        }
        this.$api.updateNoImg(User).then(re=>{
          if(re.success){
            this.$message.success({message: '修改成功', center: true})
            this.isupdate=true;
          }else {
            this.$message.error({message: '修改失败', center: true})
          }
        }).catch(err=>{
          this.$message.error({message: '服务器异常', center: true})
        })
      }else{
        this.$refs.imgUp.submit();
      }
    },
    flush(){
      this.getCurrentUser();
    },
    getCurrentUser(){
      this.$api.getCurrentUser({'id':this.userId}).then(re=>{
        if(re.id==this.userId){
          this.userData=re;
          if(re.picPath){
            // this.lmgurl="data:image/png;base64,"+re.picPath;
            this.lmgurl=re.picPath;
          }else if(re.cachePhoto){
            this.lmgurl="data:image/png;base64,"+re.cachePhoto;
          }
        }else{
          this.$message.error({message: '用户信息获取失败，请重新登录', center: true})
        }
      }).catch(er=>{
        this.$message.error({message: '服务器异常', center: true})
      })
    },
    sendAdmin(){
      if(!this.msg){
        this.$message.error({message: '请输入留言信息', center: true})
        return;
      }
      this.$api.sendAdmin({"userId":this.userId,"msg":this.msg}).then(re=>{
        if(re.success){
          this.$message.success({message: '发送信息成功', center: true})
          this.msg='';
          this.sendInfo=false;
        }else{
          this.$message.error({message: '发送信息失败', center: true})
        }
      }).catch(er=>{
        this.$message.error({message: '服务器异常', center: true})
      })
    }
  },
  filters:{
    typeFilter:function(e) {
      if(e==1)return "普通用户";
      if(e==2)return "VIP";
      if(e==3)return "管理员";
      return e;
    }
  },
  mounted() {
    this.getCurrentUser();
  }
}
</script>

<style scoped>

</style>
