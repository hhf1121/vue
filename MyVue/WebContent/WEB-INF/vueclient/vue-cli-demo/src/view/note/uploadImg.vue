<template>
  <div>
    <el-upload
      class="avatar-uploader" :limit="1"
      :action="myPath"
      :data="userData"
      :auto-upload="false"
      accept="image/jpeg,image/gif,image/png"
      :show-file-list="true"
      :submit="submit"
      list-type="picture-card"
      :before-upload="beforeAvatarUpload"
      :on-change="onchangeImg"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: "uploadImg",
    props:{
      userData:Object
    },
    data() {
      return {
        imageUrl: '',
        myPath:'/api/springBoot/loadingPhoto',
        dialogVisible:false,
        dialogImageUrl:'',
        isfile:Object,
      };
    },
    methods: {
      submit(){//第二种方式、手动提交、用axios提交
        let fd = new FormData();
        if(this.isfile){
          fd.append('file',this.isfile);//传文件
        }
        fd.append('passWord',this.userData.passWord);//传其他参数
        fd.append('address',this.userData.address);//传其他参数
        fd.append('id',this.userData.id);//传其他参数
        let config = {
          //添加请求头
          headers: { 'Content-Type':'multipart/form-data'}
        };
        const instance=axios.create({
          withCredentials: true
        })
        instance.post('/api/springBoot/loadingPhoto',fd,config).then(re=>{
          if(re.data.success){
            this.$message.success({message: '修改成功', center: true})
            this.$emit('flushData') // 调用父组件，的freshData事件，实现数据刷新
          }else{
            this.$message.error({message: '修改失败', center: true})
          }
        }).catch(err=>{
          this.$message.error({message: '服务器异常', center: true})
        })
      },
      onchangeImg(file,list) {
        //获取file对象
        this.isfile=file.raw;
        console.log(file.raw);
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(this.imageUrl)
        return isLt2M;
      },
      beforeAvatarUpload(file) {
        // let fd = new FormData();
        // console.log(file);
        // fd.append('file',file);//传文件
        // fd.append('passWord',this.userData.passWord);//传其他参数
        // fd.append('address',this.userData.address);//传其他参数
        // fd.append('id',this.userData.id);//传其他参数
        // let config = {
        //   //添加请求头
        //   headers: { 'Content-Type':'multipart/form-data'}
        // };
        // const instance=axios.create({
        //   withCredentials: true
        // })
        // instance.post('/api/springBoot/loadingPhoto',fd,config).then(re=>{
        //   if(re.success){
        //     this.$message.success({message: '修改成功', center: true})
        //   }else{
        //     this.$message.error({message: '修改失败', center: true})
        //   }
        // }).catch(err=>{
        //   this.$message.error({message: '服务器异常', center: true})
        // })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.isfile={};
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
