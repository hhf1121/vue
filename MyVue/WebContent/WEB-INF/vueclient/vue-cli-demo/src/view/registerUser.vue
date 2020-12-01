<template>
  <div>
    <h3 style="box-shadow:10px 10px 5px 5px  rebeccapurple">用户注册</h3>
    <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm" style="width: 400px;text-align: center;
      margin: 0 auto;border-radius: 10px;border: 1px slategray solid;box-shadow: 10px 10px 5px 5px #8cc5ff ">
      <el-form-item label="头像" prop="photoImg" style="margin-top: 10px">
        <el-upload
          style="margin-left: -60px"
          class="avatar-uploader"
          action="/api/springBoot/vue/loadingFile"
          :show-file-list="false"
          accept="image/jpeg,image/png"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" style="margin-left: -60px" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="账号" prop="userName" style="width: 300px">
        <el-input v-model="addForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passWord" style="width: 300px">
        <el-input v-model="addForm.passWord" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="passWord2" style="width: 300px">
        <el-input v-model="addForm.passWord2" type="password"></el-input>
      </el-form-item>
      <el-form-item label="名字" prop="name" style="width: 300px">
        <el-input v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="brithday" style="width: 300px">
        <el-date-picker
          v-model="addForm.brithday"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="地址" prop="address" style="width: 300px">
        <el-cascader filterable
                     :options="addressOptions"
                     v-model="noteAddressArray">
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
        <!--<el-input v-model="ruleForm.noteAddress"></el-input>-->
      </el-form-item>
      <el-form-item label="用户类型" prop="yes" style="width: 300px">
        <el-select v-model="addForm.yes">
          <el-option
            v-for="item in options"
            :label="item.value"
            :key="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: -60px">
        <el-button type="success" @click="save('addForm')" style="text-align: center">注册</el-button>
        <el-button type="primary" @click="resetForm('addForm')" style="text-align: center">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'registerUser',
    data() {
      //校验函数
      let _that = this;
      let validateImg = (rule, value, callback) => {
        let length = _that.addForm.picPath;
        if (!length) {
          callback(new Error("请选择并上传头像"));
        } else {
          callback();
        }
      }
      let validatorPW = (rule, value, callback) => {
        let passWord = _that.addForm.passWord;
        if (!passWord) {
          callback(new Error("请输入密码"));
        } else if (!value) {
          callback(new Error("请确认密码"));
        } else if (passWord != value) {
          callback(new Error("两次密码不一致"));
        } else {
          callback();
        }
      }
      let validatorAddress = (rule, value, callback) => {
        let noteAddressArray = _that.noteAddressArray;
        if (!noteAddressArray || noteAddressArray.length < 1) {
          callback(new Error("请选择地址"));
        } else {
          callback();
        }
      }
      let validatorType = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请选择用户类型"));
        } else if (value != 1) {
          callback(new Error("当前只能注册普通用户"));
        } else {
          callback();
        }
      }
      let validatorUserName = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入账号"));
        } else {
          //去后端校验
          _that.$api.checkUserName({"userName": value}).then(re => {
            if (!re.success) {
              callback(new Error(re.error + ""));
            } else {
              callback();
            }
          }).catch(err => {
            callback(new Error('请求后端异常'));
          })
        }
      }
      return {
        addForm: {
          userName: '',
          passWord: '',
          passWord2: '',
          address: '',
          name: '',
          brithday: '',
          picPath: ''
        },
        noteAddressArray: [],
        addressOptions: [],
        districtParams: '1,2,3',//行政等级
        options: [{key: 1, value: '普通用户'}, {key: 2, value: 'VIP'}, {key: 3, value: '管理员'}],
        imageUrl: '',
        title: '',
        rules: {
          photoImg: [
            {validator: validateImg, type: 'file', trigger: 'change'}
          ],
          passWord: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, message: '长度至少3位 ', trigger: 'blur'}
          ],
          passWord2: [
            {required: true, message: '请确认密码', trigger: 'blur'},
            {min: 3, message: '长度至少3位 ', trigger: 'blur'},
            {validator: validatorPW, type: 'string', trigger: 'blur'},
          ],
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {validator: validatorUserName, type: 'string', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入名字', trigger: 'blur'}
          ],
          address: [
            {validator: validatorAddress, type: 'string', trigger: 'blur'}
          ],
          yes: [
            {validator: validatorType, type: 'string', trigger: 'blur'}
          ],
          brithday: [
            {required: true, message: '请选择生日', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      save(addForm) {
        this.$refs[addForm].validate((valid) => {
          if (valid) {
            if (this.noteAddressArray) {//存下最后一个code编码
              this.addForm.address = this.noteAddressArray[this.noteAddressArray.length - 1];
            }
            let entity = this.addForm;
            // 后端请求数据post
            this.$api.registerUser(entity).then(res => {
              if (res.data != null) {
                this.$message.success({message: '注册成功', center: true})
                // 路由跳转到登录页面
                this.$router.push({name: 'Login', params: {}});
              } else {
                this.$message.error({message: '注册失败', center: true})
              }
            }).catch(err => {
              this.$message.error({message: '请求服务器失败', center: true})
            })
          }
        })
      },
      handleAvatarSuccess(res, file) {
        this.addForm.picPath = res.data;
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
        return isLt2M;
      },
      resetForm(formName) {
        this.addForm.picPath = "";
        this.imageUrl = "";
        this.$refs[formName].resetFields()
      },
      getSelectDistrictByLevel() {
        this.$api.getSelectDistrictByLevel({"level": this.districtParams}).then(re => {
          if (!re.success) {
            this.$message.error({message: re.error, center: true});
            return;
          }
          this.addressOptions = re.data;
        }).catch(err => {
          this.$message.error({message: '获取地址信息失败', center: true});
        })
      },
    },
    mounted() {
      this.getSelectDistrictByLevel();
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
    margin-left: -60px;
  }

  .avatar {
    width: 86px;
    height: 86px;
    display: block;
    border: #8c939d 1px dashed;
    border-radius: 5px;
  }
</style>
