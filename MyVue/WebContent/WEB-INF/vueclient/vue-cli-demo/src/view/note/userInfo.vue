<template>
  <div>
    <el-button @click="isupdate=!isupdate" style="float: right;margin-right: 100px" v-if="isupdate">修改</el-button>
    <el-button @click="isupdate=!isupdate" style="float: right;margin-right: 100px" v-if="!isupdate">取消</el-button>
    <el-form :model="userData" label-width="100px" style="width: 500px;height: 600px;margin: 10px auto 0 auto; padding-top: 50px;" >
      <el-form-item :disabled="isupdate">
        <upload-img :userData="userData"  ref="imgUp" @flushData="isupdate=true"/>
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
      isupdate:true,
      options: [{key: 1, value: '普通用户'}, {key: 2, value: 'VIP'}, {key: 3, value: '管理员'}]
    }
  },
  methods: {
    updateForm() {//修改
      this.$refs.imgUp.submit();
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
