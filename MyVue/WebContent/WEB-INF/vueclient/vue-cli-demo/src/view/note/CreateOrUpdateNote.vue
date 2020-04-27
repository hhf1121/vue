<template>
  <el-dialog :title="title" :visible="dialogShow" width="600px" :modal="false"
             :close-on-click-modal="false"
             @close="cancelForm('ruleForm')">
    <!--展示选中图片的区域-->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-button type="danger" icon="el-icon-refresh-right" size="mini" circle ref="isCall"
                 @click="resetForm('ruleForm')" @mouseover.native='isShow=true' @mouseout.native="isShow=false"
                 style="position: absolute;left: 550px;top: 50px;width: 20px;height: 20px" :loading="myloading" v-if="isView">
        <div v-show="isShow" style="position: absolute;top: -12px;right:10px;color: royalblue">点击重置</div>
      </el-button>
      <el-dialog :visible.sync="imgVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-form-item label="照片" prop="imgCode">
          <img  :src="ruleForm.imgCode" width="150px" height="150px" v-if="imgImgShow"  @click="bigImg">
        <input @change='imageAdd'  type="file" ref="imageinput">
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
        <el-input v-model="ruleForm.noteAddress"></el-input>
      </el-form-item>
      <!--<el-form-item label="活动时间" required>
		<el-col :span="10">
		  <el-form-item prop="date1">
			<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
		  </el-form-item>
		</el-col>
		<el-col class="line" :span="2">——</el-col>
		<el-col :span="10">
		  <el-form-item prop="date2">
			<el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
		  </el-form-item>
		</el-col>
	  </el-form-item>-->
      <!--<el-form-item label="即时配送" prop="delivery">
		<el-switch v-model="ruleForm.delivery"  style="float: left;margin-top: 10px;"></el-switch>
	  </el-form-item>
	  <el-form-item label="活动性质" prop="type">
		<el-checkbox-group v-model="ruleForm.type" style="border: 1px grey solid">
		  <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
		  <el-checkbox label="地推活动" name="type"></el-checkbox>
		  <el-checkbox label="线下主题活动" name="type"></el-checkbox>
		  <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
		</el-checkbox-group>
	  </el-form-item>-->
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
          imgCode:''
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
    return {
      rules: {
        noteTitle: [
          {required: true, message: '请输入标题名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
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
      options: this.NoteType,
      imageUrl: '',
      dialogVisible: false,
      disabled: false,
      imgShow:false,
      imgVisible:false,
      // showImgCode:'',
      dialogImageUrl:'',
      imgImgShow:false
    }
  },
  methods: {
    submitForm(formName) {
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
    imageAdd(event){
      var reader =new FileReader();//创建读取文件的方法
      var img1=event.target.files[0];
      reader.readAsDataURL(img1);//将文件已url的形式读入页面
      // let that=this;
      reader.onload=(e)=>{
        this.imgImgShow=false;
        this.ruleForm.imgCode= e.target.result; //把图片的二进制流付给表单ruleForm里面的imgCode
        this.imgImgShow=true;
      }
    },
    cancelForm() {
      this.resetForm('ruleForm');
      this.$emit('freshData') // 调用父组件，的freshData事件，实现数据刷新
    },
    resetForm(formName) {
      this.myloading = true
      this.ruleForm.imgCode='';
      this.imgImgShow=false;
      this.$refs[formName].resetFields()
      setTimeout(() => {
        this.myloading = false
      }, 300)
    },
    bigImg(){
      this.imgVisible=true;
      this.dialogImageUrl=this.ruleForm.imgCode;
    }
  },
  mounted(){
    //初始页面时，查询数据
    this.$nextTick(function () {
      this.ruleForm.noteName=this.userName;
      if(this.ruleForm.imgCode){
        this.imgImgShow=true;
        this.ruleForm.imgCode;
      }
    });

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
