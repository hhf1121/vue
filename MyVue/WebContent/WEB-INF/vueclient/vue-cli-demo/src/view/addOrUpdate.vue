<template>
    <el-dialog :title="title" :visible="addformVisable" width="400px" style="text-align: center;border-radius:20px;box-shadow: #66b1ff"
               :close-on-click-modal="true"  @close="cancel('ruleForm')">
      <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm" style="width: 300px">
        <el-form-item label="头像" prop="photoImg">
        <el-upload
          class="avatar-uploader"
          action="/api/springBoot/vue/loadingFile"
          :show-file-list="false"
          accept="image/jpeg,image/png"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input v-model="addForm.passWord" type="password"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="yes">
          <el-select v-model="addForm.yes" placeholder="请选择类型" >
            <el-option
              v-for="item in options"
              :label="item.value"
              :key="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button type="success" @click="save('addForm')" style="text-align: center" v-if="isview" :disabled="!isAdmin">保存</el-button>
          <el-button type="success" @click="cancel" style="text-align: center" :disabled="!isAdmin">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
  let CURRENT={};
export default {
  name: 'addOrUpdate',
  props:{
    addformVisable: {
      type: Boolean
    },
    userId:{
      type:Number
    }
  },
  data() {
    //校验函数
    let _that=this;
    let validateImg = (rule, value, callback) => {
      let length= _that.addForm.picPath;
      if(!length){
        callback(new Error("请选择并上传头像"));
      }else{
        callback();
      }
    };
    return {
      addForm: {
        userName: '',
        passWord: '',
        pass: '',
        address: '',
        name: '',
        picPath:''
      },
      options: [{key: 1, value: '普通用户'}, {key: 2, value: 'VIP'}, {key: 3, value: '管理员'}],
      isview: true,
      // addformVisable: false,
      imageUrl:'',
      title: '',
      isAdmin:true,
      rules: {
        photoImg:[
          {validator : validateImg, type:'string',  trigger: 'blur' }
        ],
        passWord: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3 , message: '长度至少3位 ', trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入名字', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入地址', trigger: 'blur'}
        ],
        yes: [
          {required: true, message: '请选择用户类型', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    save (addForm) {
      this.$refs[addForm].validate((valid) => {
        if (valid) {
          let entity = this.addForm;
          if (entity.id) {
            // 后端请求数据post
            this.$api.updateUser(entity).then(res => {
                if (res.data != null) {
                  this.$message.success({message: '更新成功', center: true})
                  if(this.userId){//在聊天窗口操作的
                    let param={};
                    param.fromId = parseInt(CURRENT.id);
                    param.toId = entity.id;
                    param.msg = "管理员修改了你的基本信息";
                    param.userName=CURRENT.userName;
                    this.$api.sendMsg(param).then(re=>{
                      if(re.success){
                        this.$message.success({message: '已通知此用户', center: true});
                      }
                    }).catch(er=>{
                      this.$message.error({message: '发送失败、请重试', center: true});
                    })
                  }
                  // this.addformVisable = false
                  this.$emit('freshData') // 调用父组件，的freshData事件，实现数据刷新
                } else {
                  this.$message.error({message: '更新失败', center: true})
                }
                // console.log(res)
              }).catch(err => {
                this.$message.error({message: '请求服务器失败', center: true})
                console.log(err)
              })

          } else {
            // 后端请求数据post
            this.$api.createUser(entity).then(res => {
                if (res.data != null) {
                  this.$message.success({message: '新增成功', center: true})
                  // this.addformVisable = false
                  this.$emit('freshData') // 调用父组件，的freshData事件，实现数据刷新
                } else {
                  this.$message.error({message: '新增失败', center: true})
                }
                // console.log(res)
              }).catch(err => {
                this.$message.error({message: '请求服务器失败', center: true})
              })
          }
        }
      })
    },
    init: function (data) {
      if (data === undefined || data === '') {
        this.title = '新增'
        this.addForm = {}
        this.imageUrl=this.addForm.picPath;
      } else {
        this.title = '修改'
        this.addForm = data;
        this.imageUrl=this.addForm.picPath;
      }
      // this.addformVisable = true
      this.isview = true
    },
    initView: function (data) {
      this.title = '查看'
      this.addForm = data;
      this.imageUrl=this.addForm.picPath;
      // this.addformVisable = true
      this.isview = false
    },
    cancel: function () {
      this.$refs['addForm'].resetFields()
      this.$emit('freshData') // 调用父组件，的freshData事件，实现数据刷新
    },
    handleAvatarSuccess(res, file) {
      this.addForm.picPath=res.data;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return  isLt2M;
    }
  },
  mounted(){
    debugger
    CURRENT=JSON.parse(sessionStorage.getItem('user'));
    if(this.userId){
      this.$api.getCurrentUser({"id":this.userId}).then(re=>{
        this.addForm=re;
        this.imageUrl=this.addForm.picPath;
        if(CURRENT.yes!=3){//不是管理员
          this.isAdmin=false
        }
      }).catch(er=>{
        this.$message.error({message: '请求服务器失败', center: true})
      })
    }
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 86px;
    height: 86px;
    line-height: 86px;
    text-align: center;
  }
  .avatar {
    width: 86px;
    height: 86px;
    display: block;
    border: #8c939d 1px dashed;
    border-radius: 5px;
  }
  /deep/ .el-dialog__header {
    background: #F2F2F2;
  }
</style>
