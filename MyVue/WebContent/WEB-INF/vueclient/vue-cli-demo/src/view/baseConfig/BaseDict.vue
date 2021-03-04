<template>
    <el-form ref="baseDictform" :inline="true" :model="baseDictDto" :rules="baseDictRules" label-width="160px"
             style="border: #8cc5ff 1px solid;box-shadow: 10px -10px 10px #a3b6f2;border-radius: 5px;">
      <el-row>
        <el-col :span="11">
          <el-form-item label="加载已存在的字典类型">
            <el-checkbox v-model="isExist"></el-checkbox>
            <el-button
              type="primary"
              icon="el-icon-refresh"
              size="medium"
              :disabled="!isExist"
              :loading="isRefreshDict"
              style="width: 20px;color:#F7CD14;background:rgba(250,115,60,0);border: none;margin-left: -10px;float: right"
              @click="refreshDict" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isExist">
        <el-col :span="11">
          <el-form-item label="字典类型" prop="configName">
            <el-input v-show="false" v-model="baseDictDto.configName"/>
            <el-select
              v-model="baseDictDto.configName"
              style="width:200px"
              placeholder="请选择"
              @change="isDictChange(baseDictDto.configName)">
              <el-option
                v-for="item in dictType"
                :key="item.label+item.value"
                :label="item.label"
                :value="item.label"
                />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="字典编码" prop="configCode">
            <el-input v-model="baseDictDto.configCode" :disabled="isExist"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isExist&&dictType.length>0" style="width: 60%;margin: 0 auto">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="历史数据" name="1" >
            <el-table
              :data="showTypeData"
              height="200"
              border
              stripe
              :header-cell-style="{'text-align':'center','color':'#6289FF'}"
              :row-class-name="tableRowClassName">
              <el-table-column type="index" label="序号" width="50" />
              <el-table-column
                prop="typeLabel"
                label="数据名称"
                width="150">
              </el-table-column>
              <el-table-column
                prop="typeValue"
                label="数据数值"
                width="180">
              </el-table-column>
              <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteData(scope.row)" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row v-if="!isExist">
        <el-col :span="11">
          <el-form-item label="类型名称" prop="configName">
            <el-input v-model="baseDictDto.configName"/>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="类型编码" prop="configCode">
            <el-input v-model="baseDictDto.configCode"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="数据名称" prop="typeLabel">
            <el-input v-model="baseDictDto.typeLabel" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="数据数值" prop="typeValue">
            <el-input v-model="baseDictDto.typeValue" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="状态:" prop="isDelete">
            <el-select v-model="baseDictDto.isDelete" :disabled="true" style="width:200px" placeholder="请选择">
              <el-option
                v-for="item in statusType"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin: 0 auto;text-align: center">
        <el-form-item>
          <el-button type="primary" @click="onSubmit('baseDictform')">
            保存
          </el-button>
          <el-button @click="cancelForm">
            取消
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
</template>

<script>
    export default {
        name: "BaseDict",
        data(){
          const _that = this;
          const validateConfigName = (rule, value, callback) => {
            if (value) {
              if (!value.includes(' ')) {
                callback();
              } else {
                callback(new Error('类型名称不能存在空格'));
              }
            }
          };
          const validateConfigCode = (rule, value, callback) => {
            if (value) {
              if (!value.includes(' ')) {
                callback();
              } else {
                callback(new Error('类型编码不能存在空格'));
              }
            }
          };

          const validateTypeValue = (rule, value, callback) => {
            if (value) {
              if (value.includes(' ')) {
                callback(new Error('不能存在空格'));
              } else if(isNaN(value)){
                callback(new Error('必须是数字'));
              }else if(parseInt(value)>9||parseInt(value)<0){
                callback(new Error('必须是0-9的数字'));
              }else {
                callback();
              }
              // 去后端校验
              _that.$api.checkedBaseConfig(this.baseDictDto).then((response) => {
                if (response != null) { // 请求成功，返回1，证明该顺序已被使用
                  if (!response.success) {
                    callback(new Error(response.error));
                  } else {
                    callback();
                  }
                } else {
                  this.$message.error({ message: '系统异常，请联系开发者', center: true });
                }
              }).finally(() => {

              });
            }
          };
          const validateTypeLabel = (rule, value, callback) => {
            if (value) {
              if (value.includes(' ')) {
                callback(new Error('不能存在空格'));
              } else {
                callback();
              }
              // 去后端校验
              _that.$api.checkedBaseConfig(this.baseDictDto).then((response) => {
                if (response != null) { // 请求成功，返回1，证明该顺序已被使用
                  if (!response.success) {
                    callback(new Error(response.error));
                  } else {
                    callback();
                  }
                } else {
                  this.$message.error({ message: '系统异常，请联系开发者', center: true });
                }
              }).finally(() => {

              });
            }
          };
          return{
            baseDictRules: {
              configName: [
                { required: true, message: '请输入类型名称', trigger: 'blur' },
                { min: 1, max: 100, message: '最长100个字符', trigger: 'blur' },
                { validator: validateConfigName, type: 'string', trigger: 'blur' }
              ],
              configCode: [
                { required: true, message: '请输入类型编码', trigger: 'blur' },
                { min: 1, max: 50, message: '最长50个字符', trigger: 'blur' },
                { validator: validateConfigCode, type: 'string', trigger: 'blur' }
              ],
              typeLabel: [
                { required: true, message: '请输入数据名称', trigger: 'blur' },
                { min: 1, max: 50, message: '最长50个字符', trigger: 'blur' },
                { validator: validateTypeLabel, type: 'string', trigger: 'blur' }
              ],
              typeValue: [
                { required: true, message: '请输入数据数值', trigger: 'blur' },
                { validator: validateTypeValue, type: 'number', trigger: 'blur' }
              ],
              isDelete: [
                { required: true, message: '此项必选', trigger: 'change' }
              ]
            },
            baseDictDto:{
              isDelete:0
            },
            isExist:false,
            dictType:[],
            statusType:[{label:'启用',value:0},{label:'禁用',value:1}],
            isRefreshDict:false,
            activeNames:["1"],
            showTypeData:[]
          }
        },
        methods:{
            deleteData(data){
                this.$api.deleteBaseConfig({id:data.id}).then(response=>{
                  if (response != null) {
                    if (response.success) {
                      this.$message.success({ message: '删除成功', center: true });
                      this.getDictType();
                      this.getDataByCode();
                    } else {
                      this.$message.error({ message: response.error, center: true });
                    }
                  } else {
                    this.$message.error({ message: '系统异常，请联系开发者', center: true });
                  }
                }).catch(err=>{
                    this.$message.error({ message: '系统异常，请联系开发者', center: true });
                })
            },
            tableRowClassName({ row, rowIndex }) {
              if (rowIndex % 2 === 1) {
                return 'single-row';
              } else {
                return 'double-row';
              }
            },
            handleChange(val) {
              console.log(val);
            },
            onSubmit(data){
              this.$refs[data].validate((valid) => {
                if (valid) {
                  console.info(this.baseDictDto);
                  this.$api.saveBaseConfig(this.baseDictDto).then((response) => {
                    if (response != null) {
                      if (response.success) {
                        this.$message.success({ message: '操作成功', center: true });
                        this.$emit('closedTab','字典类型');
                      } else {
                        this.$message.error({ message: response.error, center: true });
                      }
                    } else {
                      this.$message.error({ message: '系统异常，请联系开发者', center: true });
                    }
                  });
                }
              });
            },
            cancelForm(){
              this.$emit('closedTab','字典类型');
            },
            refreshDict(){
              this.isRefreshDict=true;
              setTimeout(o=>{
                this.getDictType();
                this.isRefreshDict=false;
              },500)
            },
            isDictChange(data){
              this.baseDictDto.configCode=this.dictType.filter(o=>o.label===data)[0].value;
              this.getDataByCode();
            },
            getDataByCode(){
              this.$api.getDataByConfigCode({"configCode":this.baseDictDto.configCode}).then((resp)=>{
                if(resp.success){
                  this.showTypeData=resp.data;
                }
              }).catch((err)=>{
                this.$message.error({ message: '系统异常，请联系开发者', center: true });
              })
            },
            getDictType(){
              this.$api.queryBaseConfig().then((resp)=>{
                if(resp.success){
                  this.dictType=resp.data.map(o=>{
                    let obj={
                      label:o.configName,
                      value:o.configCode
                    };
                    return obj;
                  });
                }
              }).catch((err)=>{
                this.$message.error({ message: '系统异常，请联系开发者', center: true });
              })
            }
        },
        watch:{
            isExist(val){
                if(val===true&&this.dictType.length===0){
                  this.getDictType();
                }
              this.baseDictDto.configCode='';
              this.baseDictDto.configName='';
              this.showTypeData=[];
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>
