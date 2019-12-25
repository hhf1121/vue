<template>
<el-dialog :title="title" :visible="dialogShow" width="600px" style="text-align: center" @close="cancelForm('ruleForm')">
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" >
  <el-button type="danger" icon="el-icon-refresh-right" size="mini" circle
             @click="resetForm('ruleForm')" @mouseover.native='isShow=true' @mouseout.native="isShow=false"
             style="position: absolute;left: 550px;top: 50px;width: 20px;height: 20px" :loading="myloading">
    <div v-show="isShow" style="position: absolute;top: -12px;right:10px;color: royalblue" >点击重置</div>
  </el-button>
  <el-form-item label="标题" prop="noteTitle">
    <el-input v-model="ruleForm.noteTitle"></el-input>
  </el-form-item>
  <el-form-item label="花销类型" prop="noteType">
    <el-select filterable v-model="ruleForm.noteType" placeholder="请选择" style="float: left">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="活动时间" required>
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
  </el-form-item>
  <el-form-item label="即时配送" prop="delivery">
    <el-switch v-model="ruleForm.delivery"  style="float: left;margin-top: 10px;"></el-switch>
  </el-form-item>
  <el-form-item label="活动性质" prop="type">
    <el-checkbox-group v-model="ruleForm.type" style="border: 1px grey solid">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="花费金额" prop="noteMoney">
    <el-input-number v-model="ruleForm.noteMoney" style="width: 200px;float: left" ></el-input-number>
  </el-form-item>
  <el-form-item label="详细备注" prop="noteRemark">
    <el-input type="textarea" v-model="ruleForm.noteRemark"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="success" @click="submitForm('ruleForm')">创建</el-button>
    <el-button type="primary" @click="cancelForm('ruleForm')">取消</el-button>
  </el-form-item>
</el-form>
</el-dialog>
</template>
<script>
export default {
  name:"CreateOrUpdate",
  props:{
    title:{
      type:String,
      default(){
        return "新增"
      }
    },
    ruleForm:{
      type:Object,
      default(){
        return{
          noteTitle: '',
          noteType: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          noteRemark: '',
          noteMoney:''
        }
      }
    },
    dialogShow:{
      type:Boolean
    }
  },
  data() {
    return {
      rules: {
        noteTitle: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        noteType: [
          { required: true, message: '请选择花销类型', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        noteMoney: [
          { required: true, message: '请输入花费金额', trigger: 'change' }
        ],
        noteRemark: [
          { required: true, message: '请填写备注信息', trigger: 'blur' }
        ]
      },
      myloading:false,
      isShow:false,
      options:this.NoteType
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancelForm(){
      this.$emit('freshData') // 调用父组件，的freshData事件，实现数据刷新
    },
    resetForm(formName) {
      this.myloading=true;
      this.$refs[formName].resetFields();
      setTimeout(() => {
        this.myloading=false
      },1000)
    }
  }
}
</script>
<style scoped>
  .el-icon-refresh-right{
    position: relative;
    right:-3px;
    top:-3px;
}
</style>
