<template>
  <el-dialog :title="title" :visible="dialogShow" width="600px" :modal="false"
             :close-on-click-modal="false"
             @close="cancelForm('ruleForm')">
    <!--展示选中图片的区域-->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-button type="danger" icon="el-icon-refresh-right" size="mini" circle ref="isCall"
                 @click="resetForm('ruleForm')" @mouseover.native='isShow=true' @mouseout.native="isShow=false"
                 style="position: absolute;left: 550px;top: 50px;width: 20px;height: 20px" :loading="myloading" v-if="isView&&title!='编辑'">
        <div v-show="isShow" style="position: absolute;top: -12px;right:10px;color: royalblue">点击重置</div>
      </el-button>
      <el-dialog :visible.sync="imgVisible" :modal="false">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-form-item label="照片" prop="imgCode">
        <el-upload
          class="upload-demo"
          action="/api/springBoot/vue/loadingFile"
          accept="image/jpeg,image/png"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload>
         <!-- <img  :src="ruleForm.imgCode" width="150px" height="150px" v-if="imgImgShow"  @click="bigImg">
        <input @change='imageAdd'  type="file" ref="imageinput">-->
      </el-form-item>
      <el-form-item label="标题" prop="noteTitle">
        <el-input v-model="ruleForm.noteTitle"></el-input>
      </el-form-item>
      <el-form-item label="花销类型" prop="noteType">
        <el-select filterable v-model="ruleForm.noteType" placeholder="请选择" style="float: left">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="noteAddress">
        <el-cascader filterable style="width: 400px;float: left"
                     :options="addressOptions"
                     v-model="noteAddressArray" >
          <template slot-scope="{ node, data }">
            <span >{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
        <!--<el-input v-model="ruleForm.noteAddress"></el-input>-->
      </el-form-item>
      <el-form-item label="花费金额" prop="noteMoney">
        <el-input-number v-model="ruleForm.noteMoney" style="width: 200px;float: left"></el-input-number>
      </el-form-item>
      <el-form-item label="详细备注" prop="noteRemark">
        <el-input type="textarea" v-model="ruleForm.noteRemark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitForm('ruleForm')" v-if="title!='编辑'&&isView">确定</el-button>
        <el-button type="success" @click="submitForm('ruleForm')" v-if="title=='编辑'">更新</el-button>
        <el-button type="primary" @click="cancelForm('ruleForm')" v-if="isView||title=='编辑'">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
// import uploadImg from '@/view/note/uploadImg'
export default {
  name: 'CreateOrUpdate',
  props: {
    title: {
      type: String,
      default() {
        return '新增'
      }
    },
    userName:{
      type:String
    },
    isView:{
      type:Boolean,
      default(){
        return true
      }
    },
    ruleForm: {
      type: Object,
      default() {
        return {
          noteTitle: '',
          noteType: '',
          noteAddress: '',
          noteRemark: '',
          noteMoney: '',
          userName:'',
          imgCode:'',
          imgVos:[]
        }
      }
    },
    dialogShow: {
      type: Boolean
    }
  },
  // components: {
  //   uploadImg
  // },
  data() {
    //校验函数
    let _that=this;
    let validateTitle = (rule, value, callback) => {
      if (value) {
        _that.ruleForm.noteTitle=value;
        //去后端校验
        _that.$api.checkTitle({"noteTitle":_that.ruleForm.noteTitle,"id":_that.ruleForm.id}).then(re=>{
          if(!re.success){
            callback(new Error(re.error+""));
          }else{
            callback();
          }
        }).catch(err=>{
          callback(new Error('请求后端异常'));
        })
      }
    };
    return {
      rules: {
        noteTitle: [
          {required: true, message: '请输入标题名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'},
          {validator : validateTitle, type:'string',  trigger: 'blur' }
        ],
        noteType: [
          {required: true, message: '请选择花销类型', trigger: 'change'}
        ],
        noteAddress: [
          {required: true, message: '请输入地址', trigger: 'blur'}
        ],
        noteMoney: [
          {required: true, message: '请输入花费金额', trigger: 'blur'}
        ],
        noteRemark: [
          {required: true, message: '请填写备注信息', trigger: 'blur'}
        ]
      },
      myloading:false,
      isShow: false,
      // options: this.NoteType,
      options: [],
      imageUrl: '',
      dialogVisible: false,
      disabled: false,
      imgShow:false,
      imgVisible:false,
      // showImgCode:'',
      dialogImageUrl:'',
      // imgImgShow:false,
      noteAddressArray:[],
      addressOptions:[],
      inputData:'',
      fileList:[],
      districtParams:'1,2,3'//行政等级
    }
  },
  methods: {
    submitForm(formName) {
      let noteAddressArray = this.noteAddressArray;
      if(noteAddressArray){//存下最后一个code编码
        this.ruleForm.noteAddress=this.noteAddressArray[noteAddressArray.length-1];
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          if(this.ruleForm.id&&this.title=='编辑'){//更新
            this.$api.updateNoteAll(this.ruleForm).then(re => {
              if(re.success){
                this.$message.success({message: '修改成功', center: true});
                this.$emit('freshData');
              }
            }).catch(er => {
            })
          }else{
            this.$api.createNote(this.ruleForm).then(re => {
              if(re.success){
                this.$message.success({message: '新增成功', center: true});
                this.$emit('freshData');
              }
            }).catch(er => {
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // imageAdd(event){
    //   var reader =new FileReader();//创建读取文件的方法
    //   var img1=event.target.files[0];
    //   reader.readAsDataURL(img1);//将文件已url的形式读入页面
    //   // let that=this;
    //   reader.onload=(e)=>{
    //     this.imgImgShow=false;
    //     this.ruleForm.imgCode= e.target.result; //把图片的二进制流付给表单ruleForm里面的imgCode
    //     this.imgImgShow=true;
    //   }
    // },
    cancelForm() {
      this.resetForm('ruleForm');
      this.$emit('freshData') // 调用父组件，的freshData事件，实现数据刷新
    },
    resetForm(formName) {
      this.myloading = true
      this.ruleForm.imgCode='';
      // this.imgImgShow=false;
      this.noteAddressArray='';
      this.fileList=[];
      this.$refs[formName].resetFields()
      setTimeout(() => {
        this.myloading = false
      }, 300)
    },
    // bigImg(){
    //   this.imgVisible=true;
    //   this.dialogImageUrl=this.ruleForm.imgCode;
    // },
    getSelectDistrictByLevel(){
      this.$api.getSelectDistrictByLevel({"level":this.districtParams}).then(re=>{
        if(!re.success){
          this.$message.error({message: re.error, center: true});
          return;
        }
        this.addressOptions=re.data;
      }).catch(err=>{
        this.$message.error({message: '获取地址信息失败', center: true});
      })
    },
    handleRemove(file, fileList) {//点击删除的时候
      let urls=fileList.map(e=>{
        return e.response?e.response.data:e.url;
      })
      //文件list
      if(urls){
        this.ruleForm.imgCode='';
        for(var i=0;i<urls.length;i++){
          this.ruleForm.imgCode+=urls[i]+";";
        }
      }
    },
    handlePreview(file) {//点击的时候
      this.imgVisible=true;
      this.dialogImageUrl=file.url;
    },
    handleAvatarSuccess(res, file) {
      if(!this.ruleForm.imgCode||this.ruleForm.imgCode.length==0){
        this.ruleForm.imgCode=res.data+";";
      }else{
        this.ruleForm.imgCode=this.ruleForm.imgCode+res.data+";";
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!');
      }
      return  isLt2M;
    }
  },
  mounted(){
    //初始页面时，查询数据
    this.$nextTick(function () {
      this.ruleForm.noteName=this.userName;//noteName冗余当前userName
      if(this.ruleForm.imgVos&&this.ruleForm.imgVos.length>0){
        // this.imgImgShow=true;
        this.fileList=this.ruleForm.imgVos;
      }
    });
    //数据字典
    this.$api.getDataByConfigCode({"configCode":'cost_type'}).then(er=>{
      if(er.success){
        if(er.data.length>0){
          this.options=er.data.map(o=>{
            var object={};
            object.label=o.typeLabel;
            object.value=o.typeValue;
            return object;
          });
        }
      }
    }).catch(err=>{
      this.$message.error({message: '字典：[cost_type]请求错误', center: true})
    });
    this.getSelectDistrictByLevel();
    //编辑、回显地址
    if(this.ruleForm.noteAddress){//410000,410100,410181
      let addressCode = this.ruleForm.noteAddress;
      var province=addressCode.substr(0,2)+"0000";
      var city=addressCode.substr(0,4)+"00";
      var zone=addressCode;
      this.noteAddressArray=[province,city,zone];
    }
  }
}
</script>
<style scoped>
  .el-icon-refresh-right {
    position: absolute;
    right: 3px;
    top: 3px;
  }
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
