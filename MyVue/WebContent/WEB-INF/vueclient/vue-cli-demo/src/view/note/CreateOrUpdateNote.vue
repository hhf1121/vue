<template>
<el-dialog :title="title" :visible="dialogShow" width="600px" style="text-align: center" @close="cancelForm('ruleForm')">
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" >
  <el-form-item label="活动名称" prop="name">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="活动地点" prop="region">
    <el-select filterable v-model="ruleForm.region" placeholder="请选择活动区域" style="float: left">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
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
    <el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
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
          name: '',
          region: '',
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
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
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
      }
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
      this.$refs[formName].resetFields();
    }
  }
}
</script>
